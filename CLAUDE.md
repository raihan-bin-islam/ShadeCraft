# ShadeCraft — Project Conventions

## Testing strategy

**Tests are scoped intentionally narrow.** Write tests ONLY for pure utility functions in `src/lib/theme-kit/` (color converters, palette generators, narrative samplers, axis weighted choice, builder helpers, etc.). NEVER for React components, integration paths, e2e flows, or "is the output beautiful" judgments.

The reasoning:
- Pure utility tests are 5-15 lines each, run in milliseconds, and catch the silent-bug class — exactly what the C1 mutation bug and C2 regex bug were before they were fixed in Phase 0.
- Component / snapshot / integration tests grow noise without proportionate value. They drift, they break on cosmetic changes, and they don't tell you whether the generated theme is actually beautiful — only humans can judge that.

When adding or refactoring algorithmic logic in `src/lib/theme-kit/`, write a tiny focused test. Things that qualify:

- Color conversions (hex → oklch, oklch → hsl, etc.)
- Chroma / lightness / hue sampling ranges
- Hue offset relationships
- Weighted-choice distribution behavior
- Builder output shape (e.g., `cssVarsBuilder` light/dark/both/merge/build)
- Constraint-satisfaction logic (e.g., narrative-driven palette assembly)

When adding UI components, hooks, store atoms, integration paths, or visual quality changes, do NOT add tests. Verification path is:

1. `yarn test` — run the pure-utility test suite (only files in `src/lib/theme-kit/**/*.test.ts`)
2. `npx tsc --noEmit` — type check
3. `yarn lint` — lint
4. Manual smoke testing in `yarn dev`

If you find yourself proposing a `*.test.tsx` for a React component or a `.spec.ts` for an end-to-end flow, stop — that crosses the line.

Expected scale: ~10-20 small test files total across the entire project lifetime, all in `src/lib/theme-kit/`.

## Package manager

This project uses **Yarn**. The `yarn.lock` is committed; there is no `package-lock.json`.

- Use `yarn install`, `yarn lint`, `yarn dev`, `yarn build`.
- Never run `npm install` or `npm run *` — it creates a competing lockfile and inconsistent `node_modules` state.
- `npx tsc --noEmit` is fine for the TypeScript compiler binary (works regardless of package manager).

## Commit style

- Lowercase conventional prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- No emojis in commit messages, code comments, or output.
- No `Co-Authored-By: Claude` lines in commit messages.

## Design / planning artifacts

- Specs live in `docs/superpowers/specs/`.
- Implementation plans live in `docs/superpowers/plans/`.
- The current evolution roadmap (Phase 0 → Phase 5) is in `docs/superpowers/specs/2026-05-09-theme-generator-evolution-design.md`.
