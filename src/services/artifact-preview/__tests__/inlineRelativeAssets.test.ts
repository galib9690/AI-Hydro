import { expect } from "chai"
import { after, before, describe, it } from "mocha"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { inlineRelativeAssets } from "../inlineRelativeAssets"

describe("inlineRelativeAssets", () => {
	let tmp: string

	before(() => {
		tmp = fs.mkdtempSync(path.join(os.tmpdir(), "inline-assets-test-"))
		fs.mkdirSync(path.join(tmp, "site_libs", "quarto-html"), { recursive: true })
		fs.writeFileSync(path.join(tmp, "site_libs", "bootstrap.css"), "body{color:red}")
		fs.writeFileSync(path.join(tmp, "site_libs", "quarto-html", "quarto.js"), "window.__quartoLoaded = true;")
	})

	after(() => {
		fs.rmSync(tmp, { recursive: true, force: true })
	})

	it("inlines a local relative stylesheet as a <style> tag", async () => {
		const html = `<html><head><link rel="stylesheet" href="site_libs/bootstrap.css"></head><body></body></html>`
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).to.contain("<style")
		expect(out).to.contain("body{color:red}")
		expect(out).not.to.contain("<link")
	})

	it("inlines a local relative script as an inline <script> tag", async () => {
		const html = `<html><head><script src="site_libs/quarto-html/quarto.js"></script></head><body></body></html>`
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).to.contain("window.__quartoLoaded = true;")
		expect(out).not.to.match(/<script[^>]*\bsrc=/i)
	})

	it("handles a nested relative path (../) correctly", async () => {
		const labsDir = path.join(tmp, "labs")
		fs.mkdirSync(labsDir, { recursive: true })
		const html = `<html><head><link rel="stylesheet" href="../site_libs/bootstrap.css"></head><body></body></html>`
		const out = await inlineRelativeAssets(html, labsDir)
		expect(out).to.contain("body{color:red}")
	})

	it("leaves absolute/CDN URLs untouched", async () => {
		const html =
			'<html><head><link rel="stylesheet" href="https://cdn.example.com/x.css"><script src="https://cdn.example.com/x.js"></script></head></html>'
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).to.equal(html)
	})

	it("leaves a stylesheet link untouched when the target file doesn't exist", async () => {
		const html = `<html><head><link rel="stylesheet" href="site_libs/missing.css"></head></html>`
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).to.equal(html)
	})

	it("does not touch non-stylesheet <link> tags", async () => {
		const html = `<html><head><link rel="icon" href="site_libs/bootstrap.css"></head></html>`
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).to.equal(html)
	})

	it("escapes a literal </style> inside inlined CSS so it cannot break out of the tag", async () => {
		fs.writeFileSync(path.join(tmp, "site_libs", "evil.css"), "body{color:red}</style><script>alert(1)</script>")
		const html = `<html><head><link rel="stylesheet" href="site_libs/evil.css"></head></html>`
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).not.to.contain("</style><script>alert(1)</script>")
		expect(out).to.contain("<\\/style")
	})

	it("preserves document structure and handles multiple assets in one document", async () => {
		const html = [
			"<html><head>",
			'<link rel="stylesheet" href="site_libs/bootstrap.css">',
			'<script src="site_libs/quarto-html/quarto.js"></script>',
			"</head><body><h1>hi</h1></body></html>",
		].join("")
		const out = await inlineRelativeAssets(html, tmp)
		expect(out).to.contain("body{color:red}")
		expect(out).to.contain("window.__quartoLoaded = true;")
		expect(out).to.contain("<h1>hi</h1>")
	})
})
