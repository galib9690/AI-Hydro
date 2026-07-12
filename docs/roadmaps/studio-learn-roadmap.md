# AI-Hydro Studio and Learn Roadmap

## Objective

Transform the existing HTML Preview and Learning Hub into a coherent AI-Hydro Studio product while connecting the Quarto-based flagship course without duplicating runtime infrastructure.

## Phase 0 — Contract audit

### Deliverables

- manifest contract document;
- executable-cell DOM contract;
- webview/iframe message map;
- proto and kernel request/output map;
- course manifest and install layout;
- progress and module-state schemas;
- auto-open, trust, CSP, and validation behavior;
- golden hand-authored module fixture;
- regression test matrix.

### Exit criteria

- current behavior is documented from source;
- fixture opens, runs, interrupts, resets, persists state, navigates course, and emits agent events;
- no contract assumptions remain undocumented for the first Quarto slice.

## Phase 1 — User-facing Studio rebrand

### Deliverables

- panel title and toolbar use AI-Hydro Studio;
- command titles and tooltips updated;
- legacy command IDs preserved;
- docs use Studio terminology with migration notes;
- artifact and Learn entry points are clearly named;
- telemetry mapping documented.

### Exit criteria

- generic artifacts and courses behave unchanged;
- legacy commands remain functional;
- screenshots pass light, dark, and narrow-width review.

## Phase 2 — Experience-specific UI

### Deliverables

- Artifact and Learn headers;
- progressive toolbar disclosure;
- course breadcrumb and previous/next navigation;
- clear kernel, validation, learning, and trust status;
- improved empty states;
- accessibility tests.

### Exit criteria

- beginners can run and check a lab without navigating environment diagnostics;
- advanced controls remain reachable;
- artifact mode has no unnecessary learning semantics.

## Phase 3 — Quarto vertical slice

### Deliverables

- audited Quarto extension prototype;
- Learning Pack source/build contract;
- Hydrologic Modeling from First Principles course recognized by Studio;
- HydroLab 01 water balance module;
- public and Studio outputs from one `.qmd` source;
- manifest/ID/schema validation;
- CI execution.

### Exit criteria

- HydroLab 01 installs and opens;
- Python execution passes deterministic closure and unit checks;
- course progress persists;
- public output works without a kernel;
- student output contains no instructor-only content.

## Phase 4 — Assessment and HydroGuide

### Deliverables

- explicit check-result events;
- attempts and hint-ladder state;
- bounded HydroGuide context builder;
- selected equation/cell/output actions;
- hidden-solution filters;
- learning transcript export.

### Exit criteria

- HydroGuide can explain, hint, and diagnose using current context;
- hidden solutions are inaccessible in student mode;
- agent context tests cover permissions and version mismatches.

## Phase 5 — HydroLabs 02 and 03

### Deliverables

- unit hydrograph and convolution lab;
- differentiable linear reservoir lab;
- volume-conservation checks;
- analytic versus numerical/gradient checks;
- prerequisite progression.

### Exit criteria

- three-module course path demonstrates static, browser-native, kernel, and agent-assisted tiers;
- learners can resume across all three modules;
- regression and accessibility suites remain green.

## Phase 6 — Internal alpha

### Activities

- recruit a small learner group;
- observe notation and workflow failures;
- measure where hints are requested;
- review execution and installation friction;
- test progress migration;
- refine course discovery and Studio onboarding.

### Exit criteria

- blocking usability defects resolved;
- major misconceptions documented and addressed;
- privacy and telemetry behavior reviewed;
- internal alpha release notes published.

## Phase 7 — Curriculum expansion

Add the flagship HydroLabs:

1. Water balance.
2. Discharge/depth conversion.
3. Unit hydrograph and convolution.
4. Snyder/SCS/Clark/ModClark.
5. SCS Curve Number.
6. HBV-family model.
7. Norms, losses, and gradients.
8. Basin-specific LSTM.
9. Differentiable state-space model.
10. Metrics, FDCs, events, and residuals.
11. Static HYDRO-ATOMS after locked-code audit.
12. Reactive corrections and conservative repartitioning after locked-code audit.

## Phase 8 — Public v1.0

### Release requirements

- versioned public Studio naming and migration notes;
- public Quarto book;
- signed or checksummed Learning Pack;
- reproducible environment and build;
- citation metadata and licenses;
- contributor and agent documentation;
- accessibility review;
- security/trust documentation;
- progress/version migration behavior;
- reviewed scientific content and explicit claim boundaries.

## Parallel workstreams

- runtime contract and tests;
- Studio UI/UX;
- Quarto extension;
- course content;
- scientific package and tests;
- progress and assessment;
- HydroGuide context;
- marketplace and pack trust;
- documentation and migration;
- accessibility and security.

## Immediate next engineering task

Complete the Phase 0 contract audit and produce one golden module fixture before generating AI-Hydro markup from Quarto.
