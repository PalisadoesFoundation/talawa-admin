---
id: design-token-system
title: Design Token System
slug: /developer-resources/design-token-system
sidebar_position: 40
---

## Overview

Using the tokens instead of the hardcoded values for the 
spacing, typography, and breakpoints to ensure there is 
UI consistency in all the pages.

## Token Files

- `src/style/tokens/colors.css`
- `src/style/tokens/spacing.css`
- `src/style/tokens/typography.css`
- `src/style/tokens/breakpoints.css`

Tokens files are imported in `src/style/tokens/index.css`
Tokens are imported globally in `src/index.tsx`

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

## Linter Reference

The repository enforces token usage in CSS and TSX via:

The validator runs in the warning mode until the complete migration for the
token is not implemented. Pass `--warn` to log issues without failing. Remove `--warn` to enforce errors after migration.

- `scripts/validate-tokens.ts`
- Pre-commit and lint-staged (staged files)
- CI (changed files in PRs)

Run locally:

- `pnpm exec tsx scripts/validate-tokens.ts --staged --warn`
- `pnpm exec tsx scripts/validate-tokens.ts --scan-entire-repo --warn`

## Notes

- Hex colors should only exist in token files.
- Use the token scales for spacing and typography instead of raw values.
- Any sort of token values should only be present in the `src/style/tokens`
