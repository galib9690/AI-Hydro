import { expect } from "chai"
import { after, before, describe, it } from "mocha"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { findQuartoSiteRoot } from "../quartoSiteRoot"

describe("findQuartoSiteRoot", () => {
	let tmp: string

	const mkSite = (rel: string, opts: { searchJson?: boolean; siteLibs?: boolean } = {}) => {
		const dir = path.join(tmp, rel)
		fs.mkdirSync(dir, { recursive: true })
		if (opts.siteLibs !== false) {
			fs.mkdirSync(path.join(dir, "site_libs"), { recursive: true })
		}
		if (opts.searchJson !== false) {
			fs.writeFileSync(path.join(dir, "search.json"), "[]")
		}
		return dir
	}

	before(() => {
		tmp = fs.mkdtempSync(path.join(os.tmpdir(), "quarto-site-root-"))
	})

	after(() => {
		fs.rmSync(tmp, { recursive: true, force: true })
	})

	it("finds the site root one level above a labs/ page directory", () => {
		const site = mkSite("build-a/aihydro")
		const labs = path.join(site, "labs")
		fs.mkdirSync(labs, { recursive: true })
		expect(findQuartoSiteRoot(labs)).to.equal(site)
	})

	it("returns the artifact's own directory when it is itself the site root", () => {
		const site = mkSite("build-b/web")
		expect(findQuartoSiteRoot(site)).to.equal(site)
	})

	it("requires BOTH site_libs and search.json markers", () => {
		const noSearch = mkSite("build-c/aihydro", { searchJson: false })
		const page = path.join(noSearch, "labs")
		fs.mkdirSync(page, { recursive: true })
		expect(findQuartoSiteRoot(page)).to.equal(null)

		const noLibs = mkSite("build-d/aihydro", { siteLibs: false })
		const page2 = path.join(noLibs, "chapters")
		fs.mkdirSync(page2, { recursive: true })
		expect(findQuartoSiteRoot(page2)).to.equal(null)
	})

	it("stops after the walk-up cap instead of scanning to filesystem root", () => {
		const site = mkSite("build-e")
		const deep = path.join(site, "a/b/c/d")
		fs.mkdirSync(deep, { recursive: true })
		// site is 4 levels above deep — beyond the 3-level cap.
		expect(findQuartoSiteRoot(deep)).to.equal(null)
		// 3 levels up is within the cap.
		expect(findQuartoSiteRoot(path.join(site, "a/b/c"))).to.equal(site)
	})

	it("returns null for a directory with no Quarto markers anywhere", () => {
		const plain = path.join(tmp, "plain/dir")
		fs.mkdirSync(plain, { recursive: true })
		expect(findQuartoSiteRoot(plain)).to.equal(null)
	})
})
