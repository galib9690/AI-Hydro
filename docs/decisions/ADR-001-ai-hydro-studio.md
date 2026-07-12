# ADR-001: Evolve HTML Preview into AI-Hydro Studio

- **Status:** Proposed
- **Date:** 2026-07-12
- **Decision owners:** AI-Hydro maintainers

## Context

The existing feature named **HTML Preview** is no longer a simple preview surface. It already supports executable Python cells, persistent kernels, interactive controls, module validation, diagnostics, course manifests, course progress, module state, marketplace installation, and agent-visible events.

The name is implementation-oriented and undersells the capability. At the same time, renaming the entire surface to “AI-Hydro Learn” would incorrectly frame reports, dashboards, model outputs, and general executable artifacts as educational content.

A separate learning renderer would duplicate working infrastructure and create divergence in security, execution, output rendering, state, and agent integration.

## Decision

Refactor and rebrand the user-facing feature as **AI-Hydro Studio**.

Studio remains one shared interactive runtime with at least two product experiences:

1. **Artifact experience** for reports, dashboards, visualizations, and executable analyses.
2. **AI-Hydro Learn** for courses, modules, HydroLabs, progress, assessments, and HydroGuide.

The current webview, iframe, kernel, artifact registry, output renderer, diagnostics, trust, progress, and event infrastructure should be reused and incrementally renamed only where useful.

## Compatibility strategy

### Preserve initially

- existing command IDs such as `aihydro.htmlPreviewButtonClicked`;
- existing settings keys;
- existing panel/view identifiers where changing them would lose state;
- existing module manifest recognition;
- existing MCP and proto method names;
- current marketplace and installed-module records;
- current progress and module-state storage paths.

### Change first

- user-facing command titles;
- button labels and tooltips;
- panel title;
- documentation terminology;
- empty states and onboarding;
- visual hierarchy and toolbar organization.

### Change later with migration

- internal provider and service class names;
- telemetry event names;
- settings namespaces;
- proto service names;
- filesystem storage paths;
- public tool names.

Compatibility aliases and explicit migration are required for later changes.

## Experience selection

Studio should infer experience from existing course context and manifest metadata. A future explicit discriminator may be introduced, for example:

```json
{
  "experience": "learn"
}
```

Missing metadata must default to behavior compatible with existing generic artifacts.

## Consequences

### Positive

- clearer product identity;
- no duplicate renderer or kernel;
- learning becomes first-class without narrowing general artifacts;
- existing investment is preserved;
- Quarto-generated courses can use the same runtime;
- UI can be simplified through experience-specific chrome.

### Negative

- terminology will be mixed during migration;
- documentation and tests must cover legacy and new names;
- telemetry and support materials may need mapping;
- internal naming may remain temporarily inconsistent.

## Rejected alternatives

### Rename everything to AI-Hydro Learn

Rejected because generic artifacts are not necessarily learning content.

### Build a separate Learn panel

Rejected because it duplicates runtime, security, state, and agent interfaces.

### Keep HTML Preview indefinitely

Rejected because the name is vague, passive, and inaccurate for the current capability.

### Build a custom Quarto runtime in AI-Hydro

Rejected. Quarto should compile source; Studio should render and execute the generated artifact.

## Acceptance criteria

- generic artifacts open and execute unchanged;
- course navigation and progress continue working;
- user-facing primary terminology is Studio;
- legacy commands remain callable;
- learning and artifact layouts are distinguishable;
- tests cover compatibility paths;
- documentation identifies legacy names where needed;
- no new parallel kernel or renderer is introduced.
