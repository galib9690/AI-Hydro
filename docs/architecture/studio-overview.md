# AI-Hydro Studio Architecture Overview

## Scope

This document describes the target architecture for evolving the existing HTML Preview and Learning Hub into AI-Hydro Studio. It is a product and engineering map, not a substitute for inspecting the current implementation.

## Current foundation

The present implementation already includes a single VS Code webview panel with a React shell and iframe-loaded artifacts, artifact registration, executable-cell bridges, Python kernels, output rendering, course loading, course progress, module state, diagnostics, validation, marketplace support, and agent event relays.

The target architecture preserves these foundations.

## Logical architecture

```text
VS Code extension host
│
├── Studio panel provider
│   ├── panel lifecycle
│   ├── local resource roots and CSP
│   ├── shell bootstrap
│   └── host message routing
│
├── Artifact registry
│   ├── loaded artifacts
│   ├── file and inline artifacts
│   ├── content hashes
│   └── artifact metadata
│
├── Runtime services
│   ├── kernel sessions
│   ├── execution and interruption
│   ├── environment discovery
│   ├── output transport
│   └── trust enforcement
│
├── Learning services
│   ├── course loader
│   ├── course installer and marketplace
│   ├── progress store
│   ├── module-control store
│   └── prerequisite and resume behavior
│
├── Agent integration
│   ├── preview/studio session events
│   ├── focus and revision actions
│   ├── contextual task launch
│   └── MCP/proto surfaces
│
└── Provenance and validation
    ├── module validator
    ├── diagnostics
    ├── session state
    └── artifact save/reload behavior

Studio webview shell
│
├── navigation and artifact list
├── experience-specific header
├── progressive toolbar
├── iframe host
├── kernel and validation status
├── course navigation and progress
└── diagnostics and advanced controls

Artifact iframe
│
├── module manifest
├── executable cells
├── outputs
├── quizzes and interactions
├── window.aihydro bridge
└── static browser fallback
```

## Experience model

### Artifact experience

Use for reports, dashboards, maps, model diagnostics, and general executable HTML.

Core UI:

- artifact title and location;
- Run, Run All, Stop, Reset, and reload;
- status and errors;
- optional advanced kernel/environment controls;
- open source, save, export, and browser actions;
- agent actions such as explain, revise, or diagnose.

No progress, prerequisite, or mastery semantics are assumed.

### Learn experience

Use when a module belongs to a course or explicitly declares learning semantics.

Additional UI:

- course and module title;
- previous/next navigation;
- progress and completion;
- prerequisite state;
- Check Work and hint actions;
- HydroGuide context actions;
- learning transcript and resume behavior.

The same runtime executes the artifact.

## State boundaries

### Open-artifact state

Which artifacts are registered and active. Owned by the artifact service and Studio shell.

### Kernel state

Interpreter, namespace, busy state, execution history, and errors. Owned by runtime services.

### Module-control state

Interactive inputs such as slider values. Persisted independently from kernel state.

### Course progress

Current module, completion, timestamps, and later assessment/mastery details. Persisted independently from kernel and control state.

### Agent-observation state

Manifest, current focus, cell status, errors, and recent events exposed through the preview/studio session bridge.

### Provenance state

Source path, environment, inputs, tool calls, edits, and claims. It may reference runtime events but has a separate lifecycle.

## Contract surfaces requiring explicit audit

Before implementing Quarto generation or incompatible changes, document and test:

1. module manifest MIME type and fields;
2. executable-cell DOM structure and required attributes;
3. iframe-to-shell message types;
4. shell-to-extension messages;
5. gRPC/proto services and generated clients;
6. kernel request and output schemas;
7. course manifest discovery and normalization;
8. progress and module-state persistence formats;
9. auto-open detection;
10. workspace-trust behavior;
11. CSP and local-resource rules;
12. marketplace installation and compatibility fields;
13. agent event and revision protocols;
14. save/reload behavior.

## Compatibility envelope

The first Studio refactor should change presentation without changing persistence or public contracts.

```text
User-facing names and layout       change first
Internal TypeScript names          optional, later
Command IDs and settings keys      preserve with aliases
Proto and MCP method names         preserve until versioned migration
Storage directories and JSON shape preserve until migration
Manifest and DOM contract          preserve and document
```

## Suggested internal decomposition

Names below express responsibilities and should be adapted to the real repository structure.

```text
studio/
├── runtime/
│   ├── panel-provider
│   ├── artifact-registry
│   ├── kernel-session
│   ├── output-renderer
│   └── message-bridge
├── experiences/
│   ├── artifact
│   └── learn
├── learning/
│   ├── course-loader
│   ├── progress
│   ├── assessment
│   └── hydroguide-context
├── validation/
└── migration/
```

Do not perform a large folder rename before tests establish the current contract.

## Experience detection

Initial priority:

1. existing course manifest association;
2. explicit module metadata when introduced;
3. fallback to artifact experience.

The fallback must preserve existing behavior.

## Agent context flow

```text
user focuses section/cell/output
        ↓
iframe emits bounded event
        ↓
Studio records current module and focus
        ↓
agent action requests explicit context
        ↓
context builder includes allowed learner/runtime information
        ↓
agent explains, hints, diagnoses, or revises
        ↓
result returns to chat and/or targeted module action
```

Instructor-only content and secrets must not enter this flow.

## Security model

- VS Code workspace trust gates execution.
- iframe CSP and sandbox remain restrictive.
- local resource roots are explicit.
- learning packs declare capabilities.
- unverified packs display warnings.
- network and filesystem access are bounded.
- credentials are never injected into cells by default.
- agent revision actions are targeted, logged, and reviewable.

## Accessibility model

Studio shell and injected controls must support:

- keyboard navigation;
- visible focus;
- semantic control names;
- execution-status announcements;
- reduced motion;
- non-color state cues;
- logical reading order;
- accessible course progress and error reporting.

## Testing layers

### Unit

Manifest parsing, course loading, progress migration, experience detection, command aliases, state reducers, and context filtering.

### Component

Artifact and Learn headers, toolbar disclosure, progress display, prerequisite states, and accessible interaction.

### Integration

Open artifact, execute cell, interrupt, reset kernel, restore module state, navigate course, persist progress, and launch agent task.

### Golden fixture

A hand-authored module that covers manifest, Python cell, output, quiz, interaction, course navigation, progress, save/reload, and agent events.

### Regression

Existing generic modules and dashboards must behave identically under the Studio branding layer.

## Delivery rule

The correct sequence is:

1. document and test current contracts;
2. introduce user-facing Studio terminology with aliases;
3. simplify and separate Artifact and Learn chrome;
4. connect Quarto-generated modules;
5. extend assessment and HydroGuide context;
6. migrate internal names only when justified.
