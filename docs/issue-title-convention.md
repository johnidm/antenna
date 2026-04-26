# Issue Title Convention

A consistent issue title format makes it easier to scan the backlog, filter by type, and understand scope at a glance.

## Format

```
[Type] Short, imperative description
```

## Types

| Prefix | When to use |
|---|---|
| `[Feature]` | New functionality being added |
| `[Improvement]` | Enhancing or optimizing something that already exists |
| `[Bug]` | Something is broken or behaving incorrectly |
| `[Chore]` | Maintenance, configuration, or tooling work |
| `[Refactor]` | Code restructuring without behavior changes |
| `[Docs]` | Documentation only |
| `[Security]` | Security-related fixes or improvements |

## Rules for the Description

- Use the **imperative mood** — "Add", "Fix", "Remove", "Update", not "Added" or "Adding"
- Be **specific but concise** — mention *what*, not *how*
- Aim for **5–8 words** after the prefix
- Avoid vague words like "misc", "stuff", or "various"

## Examples

```
[Feature] Station profile page
[Improvement] Setup Biome
[Improvement] Setup CodeRabbit
[Improvement] Sanitize radio station database
[Bug] Fix player not resuming after tab switch
[Chore] Freeze dependencies
[Refactor] Extract audio player into standalone component
[Docs] Add setup instructions to README
[Security] Sanitize user input on search endpoint
```

## Why It Matters

Consistency across titles means:

- The backlog is easier to scan and filter
- New contributors immediately understand the scope of an issue
- Labels and automation can reliably key off the prefix
- PRs linked to issues follow the same language naturally