---
id: design-token-system
title: Design Token System
slug: /developer-resources/design-token-system
sidebar_position: 40
---

## Overview

The Design Token System has been introduced, if you want to use any colour or any dimensional values you must refer to the `src/style/tokens` and use tokens from there.
If the desired color or sizes are not present in the token files then you may add that in the token
file with proper naming convention, then reference it via `var(--token-name)`.

## Token Files

- `src/style/tokens/colors.css`
- `src/style/tokens/spacing.css`
- `src/style/tokens/typography.css`
- `src/style/tokens/breakpoints.css`

Token files are imported in `src/style/tokens/index.css`.
Tokens are imported globally in `src/index.tsx`.

## Naming Convention

- Colors: `--color-<family>-<scale>` (example: `--color-gray-100`) or `--color-<name>` for base colors.
- Spacing: `--space-<step>` (example: `--space-4`).
- Typography: `--font-size-<size>`, `--line-height-<name>`, `--font-weight-<name>`, `--letter-spacing-<name>`.
- Breakpoints: `--breakpoint-<size>` (example: `--breakpoint-md`).

Follow the existing scale order and units in each file when adding new tokens.

## Usage

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-surface);
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-medium);
}
```

```tsx
<button
  style={{
    marginTop: 'var(--space-4)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
  }}
>
  Save
</button>
```

## Validation and CI/CD Checks

Token usage is enforced by `scripts/validate-tokens.ts`, which scans `src/` CSS/TS/TSX files (excluding token files and `src/assets/css/app.css`) for hardcoded values:

- Hex colors (for example: `#ffffff`)
- `px` values in spacing-related declarations (`margin`, `padding`, `width`, `height`, `gap`, `top`, `right`, `bottom`, `left`)
- `font-size` in `px`
- Numeric `font-weight` values (for example: `600`)

Local checks:

- `lint-staged` runs `npx tsx scripts/validate-tokens.ts --files` on staged `*.ts`, `*.tsx`, `*.css`, `*.scss`, `*.sass`.
- `.husky/pre-commit` runs `lint-staged`, so violations fail the commit before it is created.

CI/CD checks:

- The PR workflow runs `pnpm exec tsx scripts/validate-tokens.ts --files $CHANGED_FILES` to scan only the files changed in the PR, and the job fails if hardcoded values are found.

These guardrails catch new hardcoded values before merge and keep token usage consistent without slowing down CI with full-repo scans.

Run locally:

- `pnpm exec tsx scripts/validate-tokens.ts --staged`
- `pnpm exec tsx scripts/validate-tokens.ts --files src/path/to/file.tsx`
- `pnpm exec tsx scripts/validate-tokens.ts --scan-entire-repo`

### Current Limitations

- Spacing detection only matches a single `px` value in simple CSS declarations, so shorthands like `padding: 8px 16px` may only flag the first value.
- TSX inline styles (including MUI `sx`) and camelCase properties like `marginTop` are not parsed by the current regex checks.
- Only `px` is checked for spacing and font sizes; `rem`/`em` values are not detected.

### Planned Follow-up Work

- Add camelCase property patterns for TSX (for example: `marginTop`, `paddingX`, `fontSize`).
- Detect `rem`/`em` units with a token allowlist to avoid false positives.

## Notes

- Hex colors and raw unit values should only exist in token files.
- Use the token scales for spacing and typography instead of raw values.
- If a needed value does not exist, add it in `src/style/tokens` following the naming conventions above.
