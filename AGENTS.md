# Agent Instructions for AI-Hydro

These instructions apply to intelligent agents modifying the AI-Hydro platform.

## Mission

Build AI-Hydro as an open platform for autonomous, reproducible hydrologic and earth-science research. Extend its interactive artifact and learning capabilities through **AI-Hydro Studio** without duplicating the existing webview, kernel, course, progress, marketplace, or agent-integration infrastructure.

## Required context

Before changing Studio or learning behavior, read:

1. `VISION.md`
2. `docs/decisions/ADR-001-ai-hydro-studio.md`
3. `docs/architecture/studio-overview.md`
4. `docs/architecture/quarto-learning-integration.md`
5. `docs/product/studio-naming-and-ux.md`
6. the relevant implementation, proto, tests, and recent commits

The companion content repository is:

```text
AI-Hydro/hydrologic-modeling-first-principles
```

Its `AGENTS.md` governs book, HydroLab, Quarto, and scientific-content changes.

## Current-system rule

Do not plan from the old name “HTML Preview” alone. Inspect the current implementation first. The platform already includes substantial interactive and learning infrastructure, including:

- a single React-shell webview with iframe-loaded artifacts;
- per-artifact Python-kernel behavior;
- executable cells and output rendering;
- course manifest loading;
- course navigation and persistent progress;
- module control-state persistence;
- Courses / Modules / My Learning marketplace behavior;
- preview-session events exposed to agents;
- validation, trust, and diagnostics behavior.

Extend and refactor these capabilities. Do not silently replace them with a parallel system.

## Non-negotiable architecture rules

1. **One shared runtime.** Do not create a second lesson webview or Python kernel.
2. **Two primary experiences.** Studio supports generic artifacts and AI-Hydro Learn.
3. **Backward compatibility.** Existing HTML modules, commands, settings, manifests, stored progress, marketplace entries, and MCP tools must keep working or have an explicit migration.
4. **Stable contracts.** Do not guess DOM, manifest, proto, gRPC/postMessage, kernel, output, event, course, or trust interfaces.
5. **Progress is not kernel state.** Restarting a kernel must not erase learning completion.
6. **Generic artifacts remain first-class.** Reports and dashboards must not be forced into course semantics.
7. **Security by declaration.** Learning packs must not gain implicit network, filesystem, or credential access.
8. **Student/instructor separation.** Hidden solutions must never leak through bundles, context, logs, or agent retrieval.

## Product terminology

Use:

- **AI-Hydro Studio** — user-facing shared interactive runtime.
- **AI-Hydro Learn** — course and learning experience inside Studio.
- **HydroLabs** — executable learning modules.
- **HydroGuide** — context-aware tutor behavior.
- **Artifact experience** — reports, dashboards, visualizations, and executable analyses.

Treat “HTML Preview” as a legacy implementation and compatibility term during migration.

## Required agent workflow

For every task:

1. Inspect relevant source, tests, protos, settings, documentation, and recent commits.
2. State current behavior and desired behavior.
3. Identify compatibility, persistence, security, accessibility, and UX risks.
4. Define acceptance criteria.
5. Make the smallest coherent change.
6. Add or update tests.
7. Run TypeScript, webview, and relevant integration checks.
8. Review artifact and learning experiences separately.
9. Update documentation and migration notes.
10. Report evidence and unresolved limitations.

## UI/UX rules

- Use progressive disclosure; beginner controls should not expose every kernel diagnostic by default.
- Preserve advanced controls in menus or expandable panels.
- Distinguish course navigation from artifact switching.
- Make execution state, progress state, and validation state visually distinct.
- Ensure keyboard operation, visible focus, accessible names, reduced motion, and non-color status cues.
- Never rename a command or setting without an alias or migration period.

## Runtime contract changes

Any contract change must document:

- old and new schema;
- version negotiation;
- fallback behavior;
- stored-state migration;
- marketplace compatibility;
- agent/MCP impact;
- security impact;
- tests and fixtures.

Use a golden hand-authored module and regression fixtures before adding Quarto generation.

## Pull-request evidence

Studio or Learn pull requests must include:

- affected commands, settings, providers, services, proto messages, and webview components;
- screenshots or recordings for visible changes;
- behavior before and after;
- automated tests and manual checks;
- generic-artifact regression results;
- course/progress migration behavior;
- accessibility review;
- security and trust review;
- documentation updates;
- remaining limitations.

## Stop conditions

Stop rather than guess when:

- an existing contract cannot be located;
- stored progress could be invalidated;
- a change may expose files, network, or credentials;
- a feature duplicates an existing service;
- learner and generic-artifact requirements conflict;
- instructor content isolation is uncertain;
- a UI rename may break commands, telemetry, settings, or integrations.
