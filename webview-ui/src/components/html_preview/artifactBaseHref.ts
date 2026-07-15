/**
 * Base-URL fidelity for srcdoc-rendered artifacts.
 *
 * A `srcdoc` document's base URL is `about:srcdoc`, so an artifact's relative
 * references (`../site_libs/bootstrap.css`, `figures/plot.png`, …) can never
 * resolve — Quarto/Bootstrap styling and theme JS silently fail to load. The
 * installed-Learning-Pack path already fixes this via `applyInstalledPackCsp`;
 * this module generalizes ONLY the base-href part to generic artifacts.
 *
 * Rules:
 *   • The trailing slash is mandatory. A base of `…/labs` (no slash) drops the
 *     last path segment before relative resolution, landing one directory too
 *     high (`../site_libs` → `…/site_libs` instead of `…/aihydro/site_libs`).
 *   • An authored `<base>` wins — the artifact knows its own intent; we never
 *     stack a second base element (the first one in tree order would win
 *     anyway, so injecting ours after theirs would be dead markup, and before
 *     theirs would override authored behavior).
 *   • Installed Learning Packs are handled by `applyInstalledPackCsp`, which
 *     strips authored bases deliberately (self-contained archives must not
 *     re-point resolution); this helper is for everything else.
 *
 * KNOWN LIMITATION (verified empirically 2026-07-14, real VS Code panel):
 * correcting the base href alone is NOT sufficient for a nested `srcdoc`
 * iframe to actually FETCH cross-origin `vscode-resource:` sibling assets —
 * even a same-directory, zero-`../` sibling 404s regardless of correct URL
 * resolution or `localResourceRoots` coverage. The resource-protocol handler
 * does not appear to extend into a `srcdoc` iframe's own fetch context, only
 * into the top-level webview's. `ArtifactPreviewService` flags such
 * artifacts via `metadata.multiFileSite`, and `isMultiFileSite()` here
 * exposes that flag, but the render path is NOT switched on it yet — doing
 * so naively (srcdoc → src) would drop the injected cell-execution bridge
 * (Run buttons stop working) since raw `src` navigation loads the artifact's
 * unmodified file, bypassing the script injection `srcdocWithDiag` performs.
 * The correct fix materializes the fully-composed HTML (bridge scripts +
 * this base tag) to a real file and navigates `src` to THAT — see
 * docs/roadmap/studio-redesign-plan.md (Studio repo) for the follow-up PR.
 */

const AUTHORED_BASE_TAG = /<base\b[^>]*>/iu

export function normalizeDirHref(dirUri: string): string {
	return `${dirUri.replace(/\/+$/u, "")}/`
}

export function escapeAttr(value: string): string {
	return value.replace(/&/gu, "&amp;").replace(/"/gu, "&quot;")
}

export function buildBaseTag(dirUri: string): string {
	return `<base href="${escapeAttr(normalizeDirHref(dirUri))}">`
}

/**
 * Inject `<base href="<dirUri>/">` for a generic srcdoc artifact so its
 * relative asset references resolve against the artifact's real directory
 * (served by VS Code's webview resource scheme). No-op when there is no
 * directory URI or the document authored its own `<base>`.
 */
export function applyArtifactBaseHref(html: string, dirUri?: string): string {
	if (!dirUri) {
		return html
	}
	// `<base>` is only meaningful inside `<head>` per the HTML spec, so restrict
	// the authored-tag check to that region. A whole-document regex scan is too
	// eager: prose in comments or code samples that happens to contain the
	// literal text "<base ...>" (e.g. documentation explaining base-href
	// behavior) would otherwise be mistaken for a real authored tag and
	// silently suppress injection everywhere it appears, including the body.
	const headCloseIdx = html.search(/<\/head\s*>/iu)
	const headRegion = headCloseIdx >= 0 ? html.slice(0, headCloseIdx) : html
	if (AUTHORED_BASE_TAG.test(headRegion)) {
		return html
	}
	const base = buildBaseTag(dirUri)
	const head = html.match(/<head\b[^>]*>/iu)
	if (head?.index !== undefined) {
		const insertAt = head.index + head[0].length
		return `${html.slice(0, insertAt)}${base}${html.slice(insertAt)}`
	}
	const htmlOpen = html.match(/<html\b[^>]*>/iu)
	if (htmlOpen?.index !== undefined) {
		const insertAt = htmlOpen.index + htmlOpen[0].length
		return `${html.slice(0, insertAt)}<head>${base}</head>${html.slice(insertAt)}`
	}
	return `<head>${base}</head>${html}`
}

/**
 * With a `<base>` element present, same-document fragment links
 * (`href="#section"`) resolve against the base URL and would navigate the
 * iframe away from the document (Quarto TOCs, footnotes and cross-references
 * rely on fragment links heavily). Intercept them at document level in the
 * capture phase and scroll instead. `location.hash` is intentionally NOT
 * updated: with a cross-origin base URI, history mutation would throw.
 *
 * The guard only activates when a <base> element exists, so documents without
 * one keep native anchor behavior.
 */
export const FRAGMENT_NAV_GUARD_SCRIPT = `<script>
(function () {
	document.addEventListener(
		"click",
		function (e) {
			if (!document.querySelector("base")) return;
			var el = e.target instanceof Element ? e.target.closest("a[href]") : null;
			if (!el) return;
			var href = el.getAttribute("href") || "";
			if (href.charAt(0) !== "#") return;
			e.preventDefault();
			if (href.length === 1) {
				window.scrollTo({ top: 0 });
				return;
			}
			var id;
			try {
				id = decodeURIComponent(href.slice(1));
			} catch {
				id = href.slice(1);
			}
			var target = document.getElementById(id);
			if (!target) {
				var named = document.getElementsByName(id);
				target = named.length > 0 ? named[0] : null;
			}
			if (target && typeof target.scrollIntoView === "function") {
				target.scrollIntoView();
			}
		},
		true,
	);
})();
</script>`
