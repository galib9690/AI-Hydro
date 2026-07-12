# Studio Naming and UX Specification

## Naming hierarchy

| Product layer | User-facing name |
|---|---|
| Platform | AI-Hydro |
| Interactive execution environment | AI-Hydro Studio |
| Learning experience | AI-Hydro Learn |
| Practical learning module | HydroLab |
| Context-aware tutor | HydroGuide |
| Structured installable bundle | AI-Hydro Learning Pack |

Use “HTML Preview” only in migration notes, legacy command references, and low-level implementation documentation until internal renaming is complete.

## User-facing command migration

Initial display titles:

```text
AI-Hydro: Open Studio
AI-Hydro Studio: Add Artifact
AI-Hydro Studio: Validate Module
AI-Hydro Learn: Browse Courses
AI-Hydro Learn: Resume Learning
AI-Hydro Learn: Open HydroLab
```

Preserve existing command IDs and add aliases before introducing new IDs.

## Panel title

Primary title:

```text
AI-Hydro Studio
```

Contextual subtitle or breadcrumb:

```text
Artifact · Basin Characterization Report
Learn · Hydrologic Modeling from First Principles · HydroLab 01
```

## Information architecture

Target high-level structure:

### Explore

- recent artifacts;
- reports;
- dashboards;
- visualizations;
- standalone modules;
- marketplace discovery where appropriate.

### Learn

- Courses;
- Modules;
- Featured HydroLabs;
- My Learning;
- course progress and resume.

### My Work

- recently opened artifacts;
- active learning;
- saved state;
- research sessions and provenance exports.

This structure should be reconciled with the existing Courses / Modules / My Learning tabs rather than replacing them blindly.

## Artifact experience layout

```text
┌─────────────────────────────────────────────────────────────┐
│ AI-Hydro Studio                                             │
│ Artifact · Watershed Characterization                       │
│ Run  Run All  Stop  Reset          Ask AI-Hydro      More ⋯ │
├───────────────┬─────────────────────────────────────────────┤
│ Artifacts     │                                             │
│ Report A      │  rendered interactive artifact              │
│ Dashboard B   │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

No course-progress semantics appear unless the artifact belongs to a learning experience.

## Learn experience layout

```text
┌─────────────────────────────────────────────────────────────┐
│ AI-Hydro Learn                                              │
│ Hydrologic Modeling from First Principles                   │
│ HydroLab 01 of 12 · Beginner · 35 min                       │
│ ← Previous     25% complete      Next →                     │
│ Run  Run All  Stop  Reset  Check Work  Ask HydroGuide      │
├───────────────┬─────────────────────────────────────────────┤
│ Course path   │                                             │
│ ✓ Orientation │  rendered lesson and executable cells       │
│ ● Water bal.  │                                             │
│ ○ Units       │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

## Progressive disclosure

### Primary controls

Always visible when relevant:

- Run;
- Run All;
- Stop;
- Reset;
- Check Work in Learn;
- Ask AI-Hydro or Ask HydroGuide;
- current execution state.

### Secondary controls

Place in an expandable Advanced or More menu:

- Python environment;
- refresh environments;
- restart kernel;
- probe environment;
- diagnostics;
- clear outputs;
- open source;
- copy path;
- open in browser;
- control-state export/reset.

Advanced controls remain accessible but should not dominate beginner learning.

## Status design

Do not collapse all status into one indicator.

- **Kernel:** Ready, Starting, Busy, Error, Stopped.
- **Document:** Saved, modified, stale, reloaded.
- **Validation:** Passed, warnings, failed.
- **Learning:** Not started, in progress, complete, locked.
- **Trust:** Trusted, restricted, unverified pack.

Each state requires text or icon shape in addition to color.

## Context actions

When the learner focuses or selects content, offer bounded actions:

- Explain this equation.
- Decode the symbols.
- Show the hydrologic meaning.
- Show the tensor shape.
- Give one hint.
- Check my reasoning.
- Diagnose this output.
- Explain what this result does not prove.

Artifact-mode actions may emphasize:

- Explain analysis.
- Diagnose error.
- Revise section.
- Re-run with changes.
- Add result to provenance.

## Empty states

### Studio empty state

```text
Open an interactive report, dashboard, module, or course.
[Add artifact] [Explore courses]
```

### Learn empty state

```text
Learn hydrologic modeling through executable, agent-guided courses.
[Browse courses] [Resume learning]
```

Avoid technical language such as “load an HTML file” as the primary invitation.

## Course navigation

- Show module order and prerequisites.
- Explain why a module is locked.
- Allow review of completed modules.
- Resume at the last visited module.
- Warn when stored progress belongs to a materially different version.
- Never treat opening a module as completion.

## Completion and mastery

Completion should be based on explicit module criteria rather than scroll position alone.

Potential criteria:

- required sections visited;
- required checks passed;
- reflection submitted locally;
- completion explicitly confirmed.

Mastery is a separate, optional concept and must not be inferred from a single attempt.

## Accessibility requirements

- complete keyboard navigation;
- visible focus;
- meaningful accessible names for icon buttons;
- announcements for execution and validation changes;
- progress conveyed in text, not color alone;
- reduced-motion support;
- sufficient contrast in both themes;
- minimum target size for controls;
- no focus traps between shell and iframe;
- clear error association with the responsible cell.

## Responsive behavior

For constrained widths:

- collapse the artifact/course sidebar;
- retain title, primary run/stop control, and status;
- move secondary controls into menus;
- avoid horizontal scrolling in the main toolbar;
- preserve learner position when panels open or close.

## Telemetry principles

Track product behavior, not sensitive scientific content.

Useful events:

- Studio opened;
- experience type selected;
- course installed;
- module resumed;
- run/check/hint action;
- validation failure category;
- migration fallback used.

Do not capture code, data, learner answers, file contents, or credentials without explicit policy and consent.
