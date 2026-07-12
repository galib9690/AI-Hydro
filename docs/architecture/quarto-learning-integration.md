# Quarto Learning Integration

## Decision

Quarto is the canonical authoring and compilation system for structured books and courses. AI-Hydro Studio is the interactive runtime. AI-Hydro should not implement a competing Quarto parser or publication engine.

## Pipeline

```text
reviewed .qmd source
        ↓
Quarto profiles and AI-Hydro extension
        ↓
public HTML + Studio module HTML + static editions
        ↓
AI-Hydro Learning Pack
        ↓
Studio marketplace/install
        ↓
existing Studio runtime and Python kernel
```

## Companion repository

The flagship implementation lives in:

```text
AI-Hydro/hydrologic-modeling-first-principles
```

That repository owns:

- chapters and HydroLabs;
- Quarto configuration and extension;
- scientific Python package and tests;
- course source metadata;
- references, figures, sample data, and rubrics;
- public and Learning Pack build workflows.

AI-Hydro owns runtime and installation behavior.

## Source profiles

### Public web

- searchable multi-chapter Quarto book;
- frozen or verified outputs;
- browser-native interactions only;
- clear “Open in AI-Hydro Studio” actions where appropriate;
- no misleading Python Run button without a kernel.

### AI-Hydro Studio

- executable-cell markup matching the audited contract;
- stable module, section, cell, and check IDs;
- manifest and course metadata;
- assessment and HydroGuide hooks;
- appropriate static fallback;
- no hidden instructor content.

### Student and instructor

Generated separately from the same source. Instructor-only material must be omitted at build time from student artifacts, not merely hidden with CSS.

## Contract-first implementation

Before enabling a Quarto filter, audit the current AI-Hydro implementation and record:

- manifest script type and required fields;
- cell classes, IDs, language, source, output, and run controls;
- injected bridge lifecycle;
- interactivity primitives;
- iframe and shell messages;
- kernel RPC/proto inputs and outputs;
- course manifest shape and path resolution;
- progress and completion events;
- validation rules;
- trust and CSP behavior;
- marketplace installation layout.

Create a golden hand-authored module and tests. The Quarto output must match that fixture.

## Semantic authoring

Authors should express learning intent rather than raw runtime DOM.

Conceptual source:

```markdown
::: {.hydrolab-cell #compute-storage
check="hmfp.water-balance.01.mass-closure"}

```{python}
storage_next = storage + precipitation - et - runoff
```

:::
```

A versioned Quarto extension may convert this to the exact runtime markup for the Studio profile while leaving ordinary Quarto output readable.

The example above is conceptual until the audited syntax and extension behavior are implemented.

## Stable IDs

Use human-readable identifiers independent of DOM order:

```text
course: hmfp
module: hmfp.water-balance.01
section: hmfp.water-balance.01.mass-closure
cell: hmfp.water-balance.01.compute-storage
check: hmfp.water-balance.01.unit-consistency
```

Changing prose or moving a block must not invalidate learner progress.

## Learning Pack target

```text
learning-pack/
├── pack.yml
├── course.json
├── modules/
│   └── <module-id>/module.html
├── assets/
├── datasets/
├── environments/
├── rubrics/
├── checksums.json
└── signatures/
```

The installed layout must remain compatible with current course discovery and path-normalization behavior or introduce a versioned migration.

## Capability declaration

A generated module or pack should declare only what it needs:

```yaml
execution:
  runtime: python
  kernel_scope: isolated
  network: restricted
  filesystem: module-and-workspace-readonly
  timeout_seconds: 60
python:
  - numpy
  - matplotlib
```

This is a target contract. Actual fields must align with audited runtime and installer schemas.

## Authoring convenience

A later Studio command may:

1. detect a `.qmd` file;
2. verify that Quarto is installed;
3. render the `aihydro` profile;
4. validate the generated module;
5. open it in Studio;
6. surface errors with source mapping.

The command invokes Quarto; it does not embed a second renderer.

## Testing

The integration pipeline should test:

- Quarto render success;
- generated manifest and IDs;
- no duplicate cells or checks;
- expected static fallback;
- Studio execution and outputs;
- restart and interrupt;
- course navigation and progress;
- control-state persistence;
- student/instructor separation;
- capability and trust behavior;
- accessibility;
- source-to-generated error mapping where available.

## First vertical slice

Use HydroLab 01: watershed water balance.

Acceptance sequence:

1. render public HTML from `.qmd`;
2. render Studio module from the same `.qmd`;
3. validate manifest and cell markup;
4. execute the water-balance code;
5. pass mass-closure and unit checks;
6. persist module progress;
7. provide bounded HydroGuide context;
8. verify public fallback and student build;
9. reproduce in CI.
