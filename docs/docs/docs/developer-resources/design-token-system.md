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

Token usage is enforced by `scripts/validate-tokens.ts`, which scans `src/` CSS/TS/TSX files (excluding token files and `src/assets/css/app.css`) for hardcoded values.

### Detected Patterns

#### CSS/SCSS Files

| Category | Patterns Detected |
|----------|-------------------|
| **Colors** | Hex colors (`#fff`, `#ffffff`, `#ffffffaa`), RGB/RGBA (`rgb(0,0,0)`, `rgba(0,0,0,0.5)`), HSL/HSLA (`hsl(0,0%,0%)`, `hsla(0,0%,0%,0.5)`) |
| **Spacing** | `margin`, `padding`, `width`, `height`, `gap`, `top`, `right`, `bottom`, `left`, `inset` with `px`/`rem`/`em` values (including shorthand like `padding: 8px 16px`) |
| **Typography** | `font-size` with `px`/`rem`/`em`, `font-weight` with numeric values (100-900), `line-height` with `px`/`rem`/`em` |
| **Borders** | `border-radius` with `px`/`rem`/`em`, `border-width` with units, `border` shorthand with colors |
| **Effects** | `box-shadow` with hardcoded offset/blur values and colors |

#### TSX/TS Inline Styles

| Category | Patterns Detected |
|----------|-------------------|
| **Spacing** | `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `margin`, `padding` (and logical properties like `marginInline`, `paddingBlock`) |
| **Dimensions** | `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `gap`, `rowGap`, `columnGap`, `top`, `right`, `bottom`, `left` |
| **Typography** | `fontSize` with numeric or string values, `fontWeight` with numeric values (100-900), `lineHeight` with unit values |
| **Borders** | `borderRadius` with numeric or string values |
| **Colors** | `color`, `backgroundColor`, `borderColor`, `background` with hex/rgb/hsl values |

### Allowlisted Patterns

The following patterns are **not flagged** as violations:

- CSS `var()` usage (for example: `var(--space-4)`)
- CSS `calc()` expressions
- CSS custom property definitions (`--my-token: value`)
- Zero values (`0`, `0px`)
- Percentage values (`50%`, `100%`)
- Non-dimensional properties: `z-index`, `opacity`, `flex`, `flex-grow`, `flex-shrink`, `order`
- Time-based values: `animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`

### Local Checks

- `lint-staged` runs `npx tsx scripts/validate-tokens.ts --files` on staged `*.ts`, `*.tsx`, `*.css`, `*.scss`, `*.sass`.
- `.husky/pre-commit` runs `lint-staged`, so violations fail the commit before it is created.

### CI/CD Checks

- The PR workflow runs `pnpm exec tsx scripts/validate-tokens.ts --files $CHANGED_FILES` to scan only the files changed in the PR, and the job fails if hardcoded values are found.

These guardrails catch new hardcoded values before merge and keep token usage consistent without slowing down CI with full-repo scans.

### Run Locally

```bash
# Check staged files (for pre-commit)
pnpm exec tsx scripts/validate-tokens.ts --staged --all

# Check specific files
pnpm exec tsx scripts/validate-tokens.ts --files src/path/to/file.tsx src/path/to/style.css

# Scan entire repository
pnpm exec tsx scripts/validate-tokens.ts --scan-entire-repo
```

## Notes

- Hex colors and raw unit values should only exist in token files.
- Use the token scales for spacing and typography instead of raw values.
- If a needed value does not exist, add it in `src/style/tokens` following the naming conventions above.
