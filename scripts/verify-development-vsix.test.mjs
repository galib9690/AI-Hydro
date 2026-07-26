import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import archiver from "archiver"
import { REQUIRED_LEARNING_PACK_COMMANDS, REQUIRED_RUNTIME_ENTRIES, verifyDevelopmentVsix } from "./verify-development-vsix.mjs"

function packageManifest(commands = REQUIRED_LEARNING_PACK_COMMANDS) {
	return {
		name: "ai-hydro",
		publisher: "aihydro",
		version: "0.2.7",
		main: "./dist/extension.js",
		engines: { vscode: "^1.84.0" },
		contributes: {
			commands: commands.map((command) => ({ command, title: command })),
			menus: {
				"explorer/context": [
					{
						command: "aihydro.learningPacks.install",
						when: "resourceExtname == .aihydropack",
					},
				],
			},
		},
	}
}

async function writeVsix(
	filePath,
	{ commands, extraEntries = [], manifest = packageManifest(commands), omittedEntries = [] } = {},
) {
	await new Promise((resolve, reject) => {
		const output = fs.createWriteStream(filePath)
		const archive = archiver("zip", { zlib: { level: 9 } })
		output.on("close", resolve)
		output.on("error", reject)
		archive.on("error", reject)
		archive.pipe(output)
		archive.append("<Types/>", { name: "[Content_Types].xml" })
		archive.append('<Identity Language="en-US" Id="ai-hydro" Version="0.2.7" Publisher="aihydro" />', {
			name: "extension.vsixmanifest",
		})
		archive.append(JSON.stringify(manifest), { name: "extension/package.json" })
		archive.append("module.exports = {}", { name: "extension/dist/extension.js" })
		for (const entry of REQUIRED_RUNTIME_ENTRIES) {
			if (
				[
					"[Content_Types].xml",
					"extension.vsixmanifest",
					"extension/package.json",
					"extension/dist/extension.js",
				].includes(entry) ||
				omittedEntries.includes(entry)
			) {
				continue
			}
			archive.append("fixture", { name: entry })
		}
		for (const entry of extraEntries) archive.append(entry.content, { name: entry.name })
		archive.finalize()
	})
}

function temporaryVsix(context, name) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "aihydro-vsix-contract-"))
	context.after(() => fs.rmSync(root, { force: true, recursive: true }))
	return path.join(root, name)
}

test("accepts a compiled pack-capable development VSIX", async (context) => {
	const vsix = temporaryVsix(context, "valid.vsix")
	await writeVsix(vsix)

	const result = await verifyDevelopmentVsix(vsix, {
		name: "ai-hydro",
		publisher: "aihydro",
		version: "0.2.7",
	})

	assert.equal(result.version, "0.2.7")
	assert.deepEqual(result.learningPackCommands, REQUIRED_LEARNING_PACK_COMMANDS)
	assert.match(result.sha256, /^[0-9a-f]{64}$/)
})

test("rejects a VSIX missing or duplicating a Learning Pack command", async (context) => {
	const missing = temporaryVsix(context, "missing-command.vsix")
	await writeVsix(missing, { commands: REQUIRED_LEARNING_PACK_COMMANDS.slice(0, -1) })
	await assert.rejects(() => verifyDevelopmentVsix(missing), /declare Learning Pack command exactly once/)

	const duplicate = temporaryVsix(context, "duplicate-command.vsix")
	await writeVsix(duplicate, {
		commands: [...REQUIRED_LEARNING_PACK_COMMANDS, REQUIRED_LEARNING_PACK_COMMANDS[0]],
	})
	await assert.rejects(() => verifyDevelopmentVsix(duplicate), /declare Learning Pack command exactly once/)
})

test("rejects an extension identity, version, or main mismatch", async (context) => {
	const vsix = temporaryVsix(context, "wrong-version.vsix")
	await writeVsix(vsix)
	await assert.rejects(() => verifyDevelopmentVsix(vsix, { version: "0.2.8" }), /version mismatch/)

	const wrongMain = temporaryVsix(context, "wrong-main.vsix")
	await writeVsix(wrongMain, { manifest: { ...packageManifest(), main: "./src/extension.js" } })
	await assert.rejects(() => verifyDevelopmentVsix(wrongMain), /package\.json main mismatch/)
})

test("rejects undeclared source or private workspace content", async (context) => {
	const vsix = temporaryVsix(context, "source-bearing.vsix")
	await writeVsix(vsix, {
		extraEntries: [{ content: "private implementation source", name: "extension/src/private.ts" }],
	})

	await assert.rejects(() => verifyDevelopmentVsix(vsix), /undeclared archive entry/)
})

test("rejects a missing runtime asset or Explorer install contribution", async (context) => {
	const noKernel = temporaryVsix(context, "missing-kernel.vsix")
	await writeVsix(noKernel, {
		omittedEntries: ["extension/dist/services/artifact-preview/artifact_kernel_runner.py"],
	})
	await assert.rejects(() => verifyDevelopmentVsix(noKernel), /missing required entry/)

	const noMenu = temporaryVsix(context, "missing-menu.vsix")
	const manifest = packageManifest()
	manifest.contributes.menus["explorer/context"] = []
	await writeVsix(noMenu, { manifest })
	await assert.rejects(() => verifyDevelopmentVsix(noMenu), /Explorer install action/)
})

test("rejects a known secret pattern in otherwise allowed content", async (context) => {
	const vsix = temporaryVsix(context, "secret-bearing.vsix")
	await writeVsix(vsix, {
		extraEntries: [{ content: `ghp_${"A".repeat(24)}`, name: "extension/readme.md" }],
	})

	await assert.rejects(() => verifyDevelopmentVsix(vsix), /possible GitHub token/)
})

test("rejects duplicate archive entries", async (context) => {
	const vsix = temporaryVsix(context, "duplicate-entry.vsix")
	await writeVsix(vsix, {
		extraEntries: [{ content: "duplicate", name: "extension/dist/extension.js" }],
	})

	await assert.rejects(() => verifyDevelopmentVsix(vsix), /duplicate or case-colliding entry/)
})

test("rejects Unicode case-folded path collisions and symbolic links", async (context) => {
	const collision = temporaryVsix(context, "case-collision.vsix")
	await writeVsix(collision, {
		extraEntries: [
			{ content: "<svg/>", name: "extension/assets/straße.svg" },
			{ content: "<svg/>", name: "extension/assets/strasse.svg" },
		],
	})
	await assert.rejects(() => verifyDevelopmentVsix(collision), /duplicate or case-colliding entry/)

	const symlink = temporaryVsix(context, "symlink.vsix")
	await new Promise((resolve, reject) => {
		const output = fs.createWriteStream(symlink)
		const archive = archiver("zip", { zlib: { level: 9 } })
		output.on("close", resolve)
		output.on("error", reject)
		archive.on("error", reject)
		archive.pipe(output)
		archive.symlink("extension/assets/linked.svg", "extension/assets/icons/icon.svg")
		archive.finalize()
	})
	await assert.rejects(() => verifyDevelopmentVsix(symlink), /symbolic link/)
})

test("development builder rejects injected publishing or telemetry configuration before packaging", () => {
	const result = spawnSync(process.execPath, ["scripts/build-development-vsix.mjs"], {
		cwd: path.resolve(import.meta.dirname, ".."),
		encoding: "utf8",
		env: { ...process.env, TELEMETRY_SERVICE_API_KEY: "synthetic-test-value" },
	})

	assert.notEqual(result.status, 0)
	assert.match(result.stderr, /must not inject publishing or telemetry configuration/)
})
