# AI-Hydro Studio Vision

## Product statement

**AI-Hydro Studio** is the shared interactive environment where hydrologists can run executable scientific artifacts, inspect analyses, learn modeling concepts, collaborate with an intelligent agent, and transition directly from guided instruction to reproducible research.

It evolves the existing HTML Preview and Learning Hub rather than replacing them.

## Why the rebrand is necessary

“HTML Preview” describes a file format and suggests passive rendering. The current system is already much more capable:

- executable Python cells;
- persistent kernel state;
- interactive visualizations and simulations;
- reports and dashboards;
- course navigation and progress;
- module state persistence;
- marketplace installation;
- agent-observable events and targeted revision;
- diagnostics, validation, trust, and provenance.

The user-facing product should communicate capability, not implementation detail.

## Product hierarchy

- **AI-Hydro** — autonomous hydrologic and earth-science research platform.
- **AI-Hydro Studio** — shared interactive runtime.
- **AI-Hydro Learn** — course and learning experience inside Studio.
- **HydroLabs** — executable learning modules.
- **HydroGuide** — context-aware tutor.
- **Hydrologic Modeling from First Principles** — flagship course and book.

## One runtime, multiple experiences

```text
AI-Hydro Studio
│
├── Artifact experience
│   ├── reports
│   ├── dashboards
│   ├── visualizations
│   ├── model diagnostics
│   └── executable analyses
│
└── AI-Hydro Learn
    ├── courses
    ├── modules
    ├── HydroLabs
    ├── progress and resume
    ├── prerequisites and mastery
    ├── checks and hints
    └── HydroGuide
```

Both experiences use the same underlying webview, iframe loading, Python-kernel services, output renderer, trust controls, event bridge, artifact registry, and diagnostics.

## User promise

A user should be able to:

- open an AI-generated report and explore it without leaving AI-Hydro;
- run or revise scientific code with visible execution state;
- install a course and resume where they stopped;
- ask the agent about the current equation, cell, output, error, or plot;
- move from a guided HydroLab to real data and platform tools;
- preserve provenance and understand what evidence supports each claim.

## Learning vision

AI-Hydro Learn should not behave like a static documentation site with Run buttons. It should create an equation-to-code-to-evidence loop:

```text
understand
  → predict
  → calculate
  → execute
  → visualize
  → diagnose
  → verify
  → interpret
  → apply to research
```

The flagship course, **Hydrologic Modeling from First Principles**, provides the first complete realization of this loop.

## Core principles

### Reuse before rebuilding

The current runtime already provides most foundational capabilities. New work should consolidate and improve them rather than introducing competing providers, kernels, stores, marketplaces, or protocols.

### Backward-compatible rebranding

User-facing terminology can move toward Studio while command IDs, settings, telemetry names, manifest recognition, stored state, and MCP tools remain compatible during a migration period.

### Progressive disclosure

Beginners see a clear learning toolbar. Advanced runtime, interpreter, diagnostics, and file controls remain available without dominating the interface.

### Agent-aware by design

The agent should know what is open, where the user is focused, what ran, what failed, and what learning help is allowed. Context should be explicit and bounded rather than inferred from the full artifact.

### Scientific integrity

Execution success is not scientific validation. Studio should support checks for units, conservation, timing, gradients, leakage, residuals, and provenance, with explicit claim boundaries.

### Secure executable content

Learning packs and artifacts are code. Requested capabilities, trust status, filesystem scope, network use, dependencies, and credential boundaries must be visible and enforceable.

### Accessibility is part of correctness

Keyboard use, focus management, status announcements, contrast, reduced motion, and non-color cues are release requirements.

## Target information architecture

```text
Studio
├── Explore
│   ├── Recent artifacts
│   ├── Reports
│   ├── Dashboards
│   └── Modules
├── Learn
│   ├── Courses
│   ├── Individual modules
│   ├── Featured HydroLabs
│   └── My Learning
└── My Work
    ├── Recent sessions
    ├── Saved artifacts
    ├── Active courses
    └── Provenance exports
```

The final information architecture should be validated against the current Learning Hub and artifact list rather than imposed without implementation review.

## Runtime state model

Studio must keep these states distinct:

- **artifact state** — what files and modules are open;
- **kernel state** — variables, imports, busy/error status;
- **module-control state** — sliders and interactive settings;
- **learning progress** — visits, completion, attempts, hints, mastery;
- **agent context** — current selection, output, error, and allowed help;
- **provenance state** — inputs, tools, environment, and claims.

Resetting one state must not silently destroy another.

## Quarto relationship

Quarto is the authoring and compilation system for the flagship book and future structured courses. AI-Hydro does not need to implement its own Quarto renderer.

```text
.qmd source
   ↓ Quarto build
public book HTML + Studio module HTML + static editions
   ↓
AI-Hydro Learning Pack
   ↓
AI-Hydro Studio
```

A future “Preview Quarto Module” command may invoke an installed Quarto CLI and open the generated output. That is an authoring convenience, not a second runtime.

## Success criteria

The Studio vision is realized when:

- existing generic artifacts continue to work;
- user-facing HTML Preview terminology is replaced coherently;
- courses and modules feel native rather than bolted on;
- beginner and advanced controls are appropriately layered;
- progress, control state, and kernel state behave predictably;
- the flagship Quarto course installs and executes through the existing runtime;
- HydroGuide gives contextual help without leaking hidden content;
- contract changes are versioned and tested;
- security, accessibility, and provenance are visible parts of the experience.
