# Agent Delivery Contract

## Purpose

This document defines how intelligent agents should plan, implement, test, and report changes for AI-Hydro Studio and AI-Hydro Learn.

It complements `AGENTS.md` with a task-level delivery format.

## Required task brief

Before coding, record:

```yaml
task:
  title: concise change name
  problem: user or system problem being solved
  current_behavior: observed behavior from source and tests
  target_behavior: exact intended behavior
  in_scope: []
  out_of_scope: []
  affected_contracts: []
  risks:
    compatibility: []
    persistence: []
    security: []
    accessibility: []
    scientific: []
  acceptance_criteria: []
```

Do not begin from an imagined architecture. Cite the relevant source files, tests, protos, settings, or commit history in the task notes.

## Required implementation sequence

1. **Inspect** — locate the current provider, service, webview component, proto, state store, validator, and tests.
2. **Model** — write the smallest behavior/state model needed.
3. **Protect compatibility** — preserve aliases, defaults, stored state, and generic artifacts.
4. **Implement** — make the smallest coherent source change.
5. **Test** — add unit, component, integration, and fixture coverage as applicable.
6. **Review UX** — test artifact and learning experiences separately.
7. **Review trust** — inspect CSP, sandbox, filesystem, network, and secrets.
8. **Document** — update user, architecture, migration, and contract docs.
9. **Report** — provide evidence and limitations.

## Change classes

### Class A — Text-only rebrand

Examples: command titles, labels, docs, empty states.

Required evidence:

- screenshot;
- legacy command still works;
- generic artifact and course entry points remain discoverable;
- documentation updated.

### Class B — UI behavior

Examples: new Studio navigation, toolbar disclosure, Learn header.

Required evidence:

- component tests;
- keyboard and focus testing;
- light/dark theme screenshots;
- narrow-width behavior;
- artifact and Learn regression.

### Class C — Runtime contract

Examples: manifest, messages, proto, kernel, output, events.

Required evidence:

- old/new contract table;
- version or fallback strategy;
- golden fixture;
- migration tests;
- agent/MCP compatibility;
- security review.

### Class D — Persistence

Examples: progress, module state, installed registry.

Required evidence:

- old-state fixtures;
- migration behavior;
- atomicity and corruption handling;
- version mismatch behavior;
- reset semantics;
- privacy review.

### Class E — Learning and assessment

Examples: checks, hints, mastery, HydroGuide.

Required evidence:

- learner-visible behavior;
- hidden-solution isolation;
- attempt/hint semantics;
- context-filter tests;
- claim and feedback boundaries;
- course-version behavior.

## Definition of done

A task is complete only when:

- acceptance criteria pass;
- relevant tests pass;
- compatibility behavior is documented;
- visible changes have screenshots;
- accessibility is reviewed;
- security impact is reviewed;
- user documentation is updated;
- agent instructions remain accurate;
- unresolved limitations are listed.

## Pull-request template

```markdown
## Problem

## Current behavior

## New behavior

## Architecture and contracts affected

## Compatibility and migration

## Tests run

## UI evidence

## Accessibility

## Security and trust

## Scientific or learning implications

## Documentation

## Limitations and follow-up
```

## Prohibited delivery patterns

- large rename mixed with behavior changes and no compatibility layer;
- generated code or HTML patched without changing the source generator;
- new parallel webview or kernel introduced for convenience;
- progress shape changed without fixtures and migration;
- hidden solution included then concealed with CSS;
- agent given unrestricted document or filesystem context;
- UI declared complete without keyboard and error-state testing;
- scientific check marketed as broader validation than it supports.

## Agent handoff report

At the end of work, report:

```yaml
result:
  summary: what changed
  commits: []
  tests_passed: []
  tests_not_run: []
  screenshots: []
  migrations: []
  compatibility_notes: []
  limitations: []
  recommended_next_task: one concrete follow-up
```
