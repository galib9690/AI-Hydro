import { readFile, stat } from "node:fs/promises"
import * as path from "node:path"

/**
 * Inlines local relative `<link rel="stylesheet">` and `<script src>`
 * references (e.g. Quarto's `../site_libs/bootstrap/*.css`,
 * `../site_libs/quarto-html/quarto.js`) directly into the document as
 * `<style>`/`<script>` content.
 *
 * Why: srcdoc's base URL is `about:srcdoc`, so even with a correct injected
 * `<base href>` (see artifactBaseHref.ts), a nested srcdoc iframe cannot
 * actually FETCH a resolved cross-origin `vscode-resource:` sibling asset —
 * verified empirically, and true for both remaining render paths: a nested
 * srcdoc iframe's sub-resource fetches are blocked outright (even a
 * same-directory sibling 404s regardless of localResourceRoots coverage),
 * and a `src`-navigated nested iframe pointed directly at a
 * `vscode-resource:` URL hits VS Code's own frame protections (observed as
 * a `chrome-error://chromewebdata/` navigation failure — this is the same
 * class of issue noted in HtmlPreviewView.tsx's rendering-strategy comment:
 * "VS Code's frame protections can silently render that iframe blank").
 * Inlining sidesteps both: the content becomes part of the srcdoc document
 * text itself, so no separate cross-origin request ever happens.
 *
 * Scope: only stylesheet/script tags with a *local relative* href/src (not
 * `http(s)://`, `//`, or `data:`) are touched, and only when the resolved
 * file exists and is reasonably small. Anything else — including relative
 * `url(...)` references *inside* the inlined CSS itself (e.g. web fonts) —
 * is left as-is; those are a smaller, non-blocking residual gap (missing
 * icons/fonts, not missing page structure/typography/layout) tracked
 * separately, not attempted here.
 */

const MAX_INLINE_ASSET_BYTES = 1.5 * 1024 * 1024 // per file
const MAX_TOTAL_INLINED_BYTES = 6 * 1024 * 1024 // across the whole document

const LINK_STYLESHEET_RE = /<link\b[^>]*>/gi
const SCRIPT_SRC_RE = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/script\s*>/gi

function isLocalRelative(href: string): boolean {
	if (!href) return false
	return !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)
}

function isStylesheetLink(tag: string): string | null {
	if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag)) return null
	const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)
	return hrefMatch ? hrefMatch[1] : null
}

function escapeStyleClose(css: string): string {
	// A literal "</style>" inside inlined CSS text would prematurely close
	// the tag; this can't occur in well-formed CSS but a defensive escape
	// costs nothing and prevents any pathological input from corrupting
	// the surrounding document structure.
	return css.replace(/<\/style/gi, "<\\/style")
}

function escapeScriptClose(js: string): string {
	return js.replace(/<\/script/gi, "<\\/script")
}

// Node's fs, not vscode.workspace.fs: the artifact this reads siblings of was
// already required to be a real file:// path (registerFile resolves it via
// vscode.Uri.file before this ever runs), so there is no virtual-filesystem
// scheme to route through here — and for VS Code Remote (SSH/WSL/containers)
// the extension host itself runs on the remote machine, where Node's own fs
// already sees the same local files. Using it directly keeps this module
// trivially unit-testable against real temp-dir fixtures.
async function readIfSmallEnough(fsPath: string, budget: { remaining: number }): Promise<string | null> {
	try {
		const stats = await stat(fsPath)
		if (stats.size > MAX_INLINE_ASSET_BYTES || stats.size > budget.remaining) {
			return null
		}
		const content = await readFile(fsPath, "utf-8")
		budget.remaining -= Buffer.byteLength(content, "utf-8")
		return content
	} catch {
		return null
	}
}

export async function inlineRelativeAssets(html: string, htmlDir: string): Promise<string> {
	const budget = { remaining: MAX_TOTAL_INLINED_BYTES }

	// Stylesheets first (order doesn't matter across the two passes since
	// they match disjoint tag shapes), then scripts.
	const linkMatches = Array.from(html.matchAll(LINK_STYLESHEET_RE))
	let result = html
	for (const match of linkMatches.reverse()) {
		const tag = match[0]
		const href = isStylesheetLink(tag)
		if (!href || !isLocalRelative(href)) continue
		const resolved = path.resolve(htmlDir, href.split(/[?#]/)[0])
		const css = await readIfSmallEnough(resolved, budget)
		if (css === null) continue
		const replacement = `<style data-aihydro-inlined-from="${href.replace(/"/g, "&quot;")}">${escapeStyleClose(css)}</style>`
		const start = match.index ?? 0
		result = result.slice(0, start) + replacement + result.slice(start + tag.length)
	}

	const scriptMatches = Array.from(result.matchAll(SCRIPT_SRC_RE))
	for (const match of scriptMatches.reverse()) {
		const [tag, src] = match
		if (!isLocalRelative(src)) continue
		const resolved = path.resolve(htmlDir, src.split(/[?#]/)[0])
		const js = await readIfSmallEnough(resolved, budget)
		if (js === null) continue
		const replacement = `<script data-aihydro-inlined-from="${src.replace(/"/g, "&quot;")}">${escapeScriptClose(js)}</script>`
		const start = match.index ?? 0
		result = result.slice(0, start) + replacement + result.slice(start + tag.length)
	}

	return result
}
