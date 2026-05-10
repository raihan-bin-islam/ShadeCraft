# ShadeCraft — Project Conventions

This file establishes conventions for working on ShadeCraft (the shadcn theme
generator). Sections are roughly ordered by frequency of relevance: testing
strategy and shell conventions apply to most sessions; repository scope and
verification rules apply to high-stakes operations.

**Operating principle:** prefer fewer prompts via correct command shapes over
broader allow-listing. The goal is autonomous flow on routine work and
deliberate friction on destructive work.

---

## Testing strategy

**Tests are scoped intentionally narrow.** Write tests ONLY for pure utility
functions in `src/lib/theme-kit/` (color converters, palette generators,
narrative samplers, axis weighted choice, builder helpers, etc.). NEVER for
React components, integration paths, e2e flows, or "is the output beautiful"
judgments.

The reasoning:

- Pure utility tests are 5-15 lines each, run in milliseconds, and catch the
  silent-bug class — exactly what the C1 mutation bug and C2 regex bug were
  before they were fixed in Phase 0.
- Component / snapshot / integration tests grow noise without proportionate
  value. They drift, they break on cosmetic changes, and they don't tell you
  whether the generated theme is actually beautiful — only humans can judge that.

When adding or refactoring algorithmic logic in `src/lib/theme-kit/`, write a
tiny focused test. Things that qualify:

- Color conversions (hex → oklch, oklch → hsl, etc.)
- Chroma / lightness / hue sampling ranges
- Hue offset relationships
- Weighted-choice distribution behavior
- Builder output shape (e.g., `cssVarsBuilder` light/dark/both/merge/build)
- Constraint-satisfaction logic (e.g., narrative-driven palette assembly)

When adding UI components, hooks, store atoms, integration paths, or visual
quality changes, do NOT add tests. Verification path is:

1. `yarn test` — run the pure-utility test suite (only files in `src/lib/theme-kit/**/*.test.ts`)
2. `npx tsc --noEmit` — type check
3. `yarn lint` — lint
4. Manual smoke testing in `yarn dev`

If you find yourself proposing a `*.test.tsx` for a React component or a
`.spec.ts` for an end-to-end flow, stop — that crosses the line.

Expected scale: ~10-20 small test files total across the entire project
lifetime, all in `src/lib/theme-kit/`.

---

## Shell command conventions

The terminal where Claude Code runs is launched from the project root
(`D:/workspace/personal/monetize/shadcn-theme-generator`). Bash commands
execute in subshells, so the working directory is stable across commands —
each subshell inherits the same starting directory.

For commands operating in the project root, run them directly without `cd`:

✅ `npx tsc --noEmit`
✅ `yarn dev`
✅ `git status`
✅ `ls src/lib/theme-kit/`

You don't need to prefix routine commands with `cd <project-path> && ...` —
the shell is already there.

### Do not run `pwd` to verify before constructing paths

The terminal cwd is stable across bash invocations. You always know where bash
will land — it's the project root. Construct paths directly without checking
first.

`pwd` (or `(Get-Location).Path` in PowerShell) is only appropriate when:

- A previous command failed in a way that suggests cwd confusion
- You're debugging a specific path-related error
- The user explicitly asks you to confirm location

Otherwise, skip the verification and proceed.

### Worktree operations

Worktrees live at `.claude/worktrees/<branch-name>/`. Either path style is
acceptable for worktree commands — both are pre-allowed:

**Relative (preferred for readability):**
✅ `cd .claude/worktrees/phase-3-layout-engine-a && git status`

**Absolute (acceptable when shell context calls for it):**
✅ `cd /d "D:\workspace\personal\monetize\shadcn-theme-generator\.claude\worktrees\phase-3-layout-engine-a" && git status`
✅ `Set-Location "D:\workspace\personal\monetize\shadcn-theme-generator\.claude\worktrees\phase-3-layout-engine-a"`
✅ `Get-ChildItem "D:\workspace\personal\monetize\shadcn-theme-generator\.claude\worktrees\<branch>\src"`

Both styles are pre-allowed when targeting **this project's** worktrees
specifically. Use whichever fits the shell you're in (Bash → `cd`, PowerShell
→ `Set-Location`).

**Don't insert verification steps just to use the relative form.** If
constructing the absolute path is more reliable in context, use it. Don't
chain `pwd` or `(Get-Location).Path` checks before the actual operation.

### Subagent dispatch — no per-task branch verification

When dispatching subagents to execute tasks within a phase plan, do NOT
include a `pwd && git branch --show-current` verification step in the
implementer prompt. Once a phase is underway in a worktree, the branch and
cwd are stable across all dispatches — branch checks per task are theater.

Verify ONCE at phase start (in the controller session, not the subagents).
After that, dispatch implementers directly. Include the working-directory
hint and branch name as context so the subagent knows where to construct
paths, but skip the verification step itself.

If a rogue commit happens (rare), recovery is one fast-forward — cheaper
than running the check on every task.

**Still avoid:**

❌ `cd "D:\workspace\super-effective\..."` — different repo, blocked
❌ `cd D:\..\some-other-personal-project\...` — outside this project
❌ Pre-flight `pwd` / `(Get-Location)` verification before path construction

---

## PowerShell command conventions

When PowerShell is needed, prefer flag-based forms over `if`/`else`/braces.
Brace-and-quote patterns trigger expansion-obfuscation warnings and prompt
for permission unnecessarily.

✅ `New-Item -ItemType Directory -Path .impeccable/mockups -Force`
❌ `if (-not (Test-Path ".impeccable/mockups")) { New-Item ... }`

✅ `Get-ChildItem ./src -Recurse | Select-Object Name`
✅ `Test-Path ./some-file`

### Pre-allowed read-only cmdlets

These run without prompts — use them freely for inspection:

`Get-ChildItem`, `Get-Item`, `Test-Path`, `Resolve-Path`, `(Get-Location).Path`,
`Select-Object`, `Where-Object`, `Sort-Object`, `Measure-Object`,
`ForEach-Object`, `Format-Table`, `Format-List`, `Out-String`.

`Get-ChildItem` is pre-allowed for **relative paths** (any `./...` form) and
**absolute paths within this project** (`D:\workspace\personal\monetize\
shadcn-theme-generator\...`). Listing directories outside this project will
prompt or be denied — by design.

For directory creation, prefer `New-Item -Force` (idempotent, no prompt) or
`mkdir -p` (Git Bash equivalent).

### Multi-step PowerShell logic

For anything more complex than a single pipeline, put it in a script file
under `.claude/scripts/` and invoke as `powershell ./.claude/scripts/<name>.ps1`.
Inline PowerShell with `if`/`else` blocks will trip permission prompts even
when the underlying actions are safe.

---

## Verify before destructive actions

Before executing destructive or hard-to-reverse operations, briefly verify the
relevant assumption:

- Before `git reset --hard`, `git rebase`, or `git checkout` (when discarding
  work): show current branch and last 3 commits.
- Before `yarn add`/`yarn remove`/`yarn upgrade`: confirm package name and version.
- Before deleting files or directories: list what will be deleted.
- Before running migrations or any operation that produces persistent
  artifacts: confirm the target environment.

For routine, non-destructive operations (lint, typecheck, dev server,
read-only inspections, git status/diff/log), proceed directly without
verification.

### Chained destructive commands

For sequences combining multiple destructive operations (e.g., merge +
worktree removal + branch deletion), prefer one of:

1. **Run them sequentially as separate commands** so each gets its own
   permission check.
2. **Put the workflow in a script** under `.claude/scripts/` if it's repeated.
   Scripts are easier to audit than chained `;` commands.

Avoid one-liners that chain `git merge`, `git worktree remove --force`, and
`git branch -d` in a single bash invocation. The atomic feel is illusory —
partial failures still leave inconsistent state, and a prompt asking to
approve all of them at once isn't reviewable in practice.

---

## Repository scope

This is a personal project. Do not read, edit, write, or otherwise touch files
outside this project directory. In particular, never operate on:

- `D:/workspace/super-effective/` (work repo)
- Other directories under `D:/workspace/personal/`
- Home directory (`~`, `C:/Users/<username>/`)

The permission layer enforces this — operations targeting those paths will be
blocked regardless of how the command is constructed (Bash, PowerShell,
absolute or relative paths).

Force-pushes (`git push --force*`), history rewrites (`git filter-branch`,
`git update-ref -d`), and `git reset --hard` are also blocked at the
permission layer. If a destructive history operation is genuinely needed,
surface the request and let the user execute it manually outside Claude Code.
Do not attempt to work around the permission denial.

---

## Package manager

This project uses **Yarn**. The `yarn.lock` is committed; there is no
`package-lock.json`.

- Use `yarn install`, `yarn lint`, `yarn dev`, `yarn build`.
- Never run `npm install` or `npm run *` — it creates a competing lockfile and
  inconsistent `node_modules` state.
- `npx tsc --noEmit` is fine for the TypeScript compiler binary (works
  regardless of package manager).

---

## Commit style

- Lowercase conventional prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- No emojis in commit messages, code comments, or output.
- No `Co-Authored-By: Claude` lines in commit messages.

---

## Design / planning artifacts

- Specs live in `docs/superpowers/specs/`.
- Implementation plans live in `docs/superpowers/plans/`.
- The current evolution roadmap (Phase 0 → Phase 5) is in
  `docs/superpowers/specs/2026-05-09-theme-generator-evolution-design.md`.

---

## Stack

- Next.js 15 (App Router), TypeScript strict, Tailwind, shadcn/ui, Radix
- Package manager: yarn (see Package manager section for command list)
- Type checking: `npx tsc --noEmit`
- Linting: `yarn lint`
- Formatting: `yarn format`
- Dev server: `yarn dev`

When adding shadcn components, prefer `npx shadcn add <component>` over
manually copying from the docs.
