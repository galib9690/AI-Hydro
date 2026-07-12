# AI-Hydro Studio

AI-Hydro Studio is the shared interactive environment for executable reports, dashboards, visualizations, analyses, courses, and HydroLabs.

It evolves the feature currently documented as HTML Preview and reuses the existing webview, Python-kernel, course, progress, marketplace, validation, and agent-integration infrastructure.

## Experiences

### Artifact experience

Open and execute reports, dashboards, model diagnostics, and general interactive artifacts.

### AI-Hydro Learn

Browse courses and modules, resume learning, complete HydroLabs, track progress, and ask HydroGuide for contextual help.

## Project documents

- [Studio architecture](../architecture/studio-overview.md)
- [Quarto learning integration](../architecture/quarto-learning-integration.md)
- [Naming and UX specification](../product/studio-naming-and-ux.md)
- [Agent delivery contract](../product/agent-delivery-contract.md)
- [Studio and Learn roadmap](../roadmaps/studio-learn-roadmap.md)
- [Architecture decision](../decisions/ADR-001-ai-hydro-studio.md)

## Current implementation documentation

The existing runtime details and cell APIs remain documented in:

- [HTML Preview panel](../guide/html-preview.md)
- [Interactive module cell format](../html-preview-cells.md)

Those pages will be migrated incrementally as the user-facing rebrand is implemented. Existing commands and contracts remain compatibility requirements.
