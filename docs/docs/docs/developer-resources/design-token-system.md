---
id: design-token-system
title: Design Token System
slug: /developer-resources/design-token-system
sidebar_position: 40
---

## Overview

The Design Token System is the single source of truth for all visual values in the codebase.
Every colour, spacing value, font size, border radius, shadow, and any other dimensional or stylistic value **must** come from a design token.
Hard-coded hex colours, pixel values, and raw numbers are not permitted anywhere outside the token files themselves.

If the token you need does not exist yet, add it to the appropriate token file following the naming conventions below, then reference it with `var(--token-name)`.

## Token Files

All token files live under `src/style/tokens/`:

| File | Purpose |
|------|---------|
| `colors.css` | Colour palette (grays, blues, reds, greens, yellows, base colours) |
| `spacing.css` | Spacing scale used for margin, padding, gap, width, height, and positioning |
| `typography.css` | Font sizes, line heights, font weights, and letter spacing |
| `borders.css` | Border widths, border-radius scale, shadow offsets, blur, and spread |
| `logosizes.css` | Standard logo dimension tokens |
| `index.css` | Barrel file that imports all of the above |

Token files are imported globally via `src/index.tsx`, so every token is available everywhere without any additional imports.

> **Note on breakpoints:** CSS custom properties **cannot** be used inside `@media` query conditions (for example `@media (max-width: var(--breakpoint-md))` does not work). For this reason there is no `breakpoints.css` token file. Hard-code the breakpoint values directly inside the `@media` rule — they are the one exception to the "no raw values" rule.

## Naming Conventions

| Category | Pattern | Examples |
|----------|---------|----------|
| **Colours** | `--color-<family>-<scale>` or `--color-<name>` | `--color-gray-100`, `--color-white`, `--color-blue-500` |
| **Spacing** | `--space-<step>` | `--space-0`, `--space-4`, `--space-12` |
| **Font size** | `--font-size-<size>` | `--font-size-xs`, `--font-size-md`, `--font-size-2xl` |
| **Line height** | `--line-height-<name>` | `--line-height-tight`, `--line-height-normal` |
| **Font weight** | `--font-weight-<name>` | `--font-weight-regular`, `--font-weight-bold` |
| **Letter spacing** | `--letter-spacing-<name>` | `--letter-spacing-normal`, `--letter-spacing-wide` |
| **Border width** | `--border-<step>` | `--border-1`, `--border-2` |
| **Border radius** | `--radius-<size>` | `--radius-sm`, `--radius-md`, `--radius-full` |
| **Shadow offset** | `--shadow-offset-<size>` | `--shadow-offset-xs`, `--shadow-offset-md` |
| **Shadow blur** | `--shadow-blur-<size>` | `--shadow-blur-sm`, `--shadow-blur-lg` |
| **Shadow spread** | `--shadow-spread-<size>` | `--shadow-spread-none`, `--shadow-spread-sm` |
| **Logo sizes** | `--logo-<size>` | `--logo-xs`, `--logo-lg` |

Follow the existing scale order and units in each file when adding new tokens.

---

## Component Styling Architecture

### One CSS Module Per Component

Every component **must** have its own colocated CSS module file. A component file and its styles always live side-by-side:

```
src/components/UserProfile/
├── UserProfile.tsx
├── UserProfile.module.css
└── UserProfile.spec.tsx
```

- `UserProfile.tsx` → `UserProfile.module.css`
- `LoginForm.tsx` → `LoginForm.module.css`
- `EventCard.tsx` → `EventCard.module.css`

Each CSS module is self-contained and must not depend on any global stylesheet.

### Strict Import Rule

A TSX file may **only** import styles from its own colocated CSS module. The import must follow this exact pattern:

```tsx
// UserProfile.tsx
import styles from './UserProfile.module.css';  // allowed

// These are NOT allowed:
// import styles from '../../style/app-fixed.module.css';
// import otherStyles from '../SomeOther/SomeOther.module.css';
// import globalStyles from '../../style/global.module.css';
```

**Rule:** If the component file is `Foo.tsx`, the only permitted style import is `./Foo.module.css`. No cross-component style imports. No global sheet imports.

### No Global Stylesheets

Components must not rely on any global CSS module for their styles. All visual rules for a component belong in its own `.module.css` file.

> **`app-fixed.module.css` — Legacy / Temporary:**
> The file `src/style/app-fixed.module.css` currently exists as a legacy global stylesheet. It is scheduled for removal. **Do not add new styles to it**, and **do not import from it** in new or refactored components. Ongoing migration work is moving all its classes into the appropriate colocated component CSS modules.

### No `composes`

The CSS Modules `composes` keyword is **not allowed**:

```css
/* NOT allowed */
.button {
  composes: primaryButton from '../../style/app-fixed.module.css';
}

/* NOT allowed */
.card {
  composes: baseCard from '../shared.module.css';
}
```

Instead, use design tokens directly to style each component:

```css
/* Correct — use tokens directly */
.button {
  background-color: var(--color-blue-500);
  color: var(--color-white);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}
```

If multiple components need the same visual pattern, extract a shared component (in `src/shared-components/`) rather than sharing CSS classes.

### No Hard-Coded Values in CSS Files

CSS files must not contain any raw/inline values. Every colour, size, spacing, font, border, and shadow value must reference a design token:

```css
/* NOT allowed — hard-coded values */
.card {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: rgb(33, 37, 41);
}

/* Correct — tokens only */
.card {
  background-color: var(--color-white);
  padding: var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
}
```

### No React Bootstrap Utility Classes

Do **not** use React Bootstrap utility/helper class names (e.g. `d-flex`, `p-3`, `mb-2`, `text-center`, `bg-primary`) or string-based `className` props that reference multiple Bootstrap classes. All styling must be handled through the colocated CSS module using design tokens:

```tsx
// NOT allowed — React Bootstrap utility classes
<div className="d-flex justify-content-between p-3 mb-2 bg-light rounded">
  <span className="text-muted fs-6">Hello</span>
</div>

// Correct — use CSS module classes backed by tokens
import styles from './Greeting.module.css';

<div className={styles.container}>
  <span className={styles.label}>Hello</span>
</div>
```

```css
/* Greeting.module.css */
.container {
  display: flex;
  justify-content: space-between;
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
}

.label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}
```

---

## Transparency and Colour Mixing

Do **not** use `rgba()` or `hsla()` for transparent colours. Use the modern `color-mix()` function with the `in srgb` colour space instead:

```css
/* NOT allowed */
.overlay {
  background: rgba(0, 0, 0, 0.2);
}

/* Correct — use color-mix with tokens */
.overlay {
  background: color-mix(in srgb, var(--color-black) 20%, transparent);
}

.highlight {
  background: color-mix(in srgb, var(--color-blue-500) 10%, transparent);
}

.border {
  border-color: color-mix(in srgb, var(--color-gray-700) 50%, transparent);
}
```

This approach keeps colour values tied to tokens and avoids scattering raw colour codes throughout the codebase.

---

## Usage Examples

### CSS Module (component-level)

```css
/* EventCard.module.css */
.card {
  background-color: var(--color-white);
  border: var(--border-1) solid var(--color-gray-200);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-offset-xs) var(--shadow-offset-sm) var(--shadow-blur-md) var(--shadow-spread-none)
    color-mix(in srgb, var(--color-black) 10%, transparent);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-gray-900);
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  letter-spacing: var(--letter-spacing-wide);
}
```

### TSX File

```tsx
// EventCard.tsx
import styles from './EventCard.module.css';

function EventCard({ title, subtitle }: EventCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
```

### No Inline Styles

Inline styles (`style={{ }}`) are **not allowed** in TSX files. All styling must go through the colocated CSS module:

```tsx
// NOT allowed
<button
  style={{
    marginTop: 'var(--space-4)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
  }}
>
  Save
</button>

// Correct — use the CSS module class instead
import styles from './SaveButton.module.css';

<button className={styles.saveButton}>Save</button>
```

```css
/* SaveButton.module.css */
.saveButton {
  margin-top: var(--space-4);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}
```

### Responsive Breakpoints

```css
/* Breakpoints are the one exception — raw values are allowed in @media conditions */
.container {
  padding: var(--space-5);
}

@media (max-width: 768px) {
  .container {
    padding: var(--space-3);
  }
}
```

---

## Validation and CI/CD Checks

Token usage is enforced by `scripts/validate-tokens.ts`, which scans `src/` CSS/TS/TSX files (excluding token files and `src/assets/css/app.css`) for hard-coded values.

### Detected Patterns

#### CSS/SCSS Files

| Category | Patterns Detected |
|----------|-------------------|
| **Colours** | Hex colours (`#fff`, `#ffffff`, `#ffffffaa`), RGB/RGBA (`rgb(0,0,0)`, `rgba(0,0,0,0.5)`), HSL/HSLA (`hsl(0,0%,0%)`, `hsla(0,0%,0%,0.5)`) |
| **Spacing** | `margin`, `padding`, `width`, `height`, `gap`, `top`, `right`, `bottom`, `left`, `inset` with `px`/`rem`/`em` values (including shorthand like `padding: 8px 16px`) |
| **Typography** | `font-size` with `px`/`rem`/`em`, `font-weight` with numeric values (100-900), `line-height` with `px`/`rem`/`em` |
| **Borders** | `border-radius` with `px`/`rem`/`em`, `border-width` with units, `border` shorthand with colours |
| **Effects** | `box-shadow` with hard-coded offset/blur values and colours |

#### TSX/TS Inline Styles

| Category | Patterns Detected |
|----------|-------------------|
| **Spacing** | `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `margin`, `padding` (and logical properties like `marginInline`, `paddingBlock`) |
| **Dimensions** | `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `gap`, `rowGap`, `columnGap`, `top`, `right`, `bottom`, `left` |
| **Typography** | `fontSize` with numeric or string values, `fontWeight` with numeric values (100-900), `lineHeight` with unit values |
| **Borders** | `borderRadius` with numeric or string values |
| **Colours** | `color`, `backgroundColor`, `borderColor`, `background` with hex/rgb/hsl values |

### Allowlisted Patterns

The following patterns are **not flagged** as violations:

- CSS `var()` usage (e.g. `var(--space-4)`)
- CSS `calc()` expressions
- CSS `color-mix()` expressions
- CSS custom property definitions (`--my-token: value`)
- Zero values (`0`, `0px`)
- Percentage values (`50%`, `100%`)
- Non-dimensional properties: `z-index`, `opacity`, `flex`, `flex-grow`, `flex-shrink`, `order`
- Time-based values: `animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`

### Local Checks

- `lint-staged` runs `pnpm exec tsx scripts/validate-tokens.ts --files` on staged `*.ts`, `*.tsx`, `*.css`, `*.scss`, `*.sass`.
- `.husky/pre-commit` runs `lint-staged`, so violations fail the commit before it is created.

### CI/CD Checks

- The PR workflow runs `pnpm exec tsx scripts/validate-tokens.ts --files $CHANGED_FILES` to scan only the files changed in the PR, and the job fails if hard-coded values are found.

These guardrails catch new hard-coded values before merge and keep token usage consistent without slowing down CI with full-repo scans.

### Run Locally

```bash
# Check staged files (for pre-commit)
pnpm exec tsx scripts/validate-tokens.ts --staged --all

# Check specific files
pnpm exec tsx scripts/validate-tokens.ts --files src/path/to/file.tsx src/path/to/style.css

# Scan entire repository
pnpm exec tsx scripts/validate-tokens.ts --scan-entire-repo
```

---

## Quick-Reference Rules

| Rule | Detail |
|------|--------|
| **Token-only values** | All colours, spacing, font sizes, weights, radii, and shadows must use `var(--token-name)` |
| **One CSS module per component** | `Foo.tsx` gets `Foo.module.css` — no exceptions |
| **Colocated imports only** | `Foo.tsx` may only import from `./Foo.module.css` |
| **No global sheet imports** | Never import from `app-fixed.module.css` or any other global sheet |
| **No inline styles** | `style={{ }}` is not allowed in TSX — use CSS module classes instead |
| **No hard-coded CSS values** | CSS files must not contain raw hex, px, rem, or rgb values — use tokens via `var()` |
| **No React Bootstrap classes** | Do not use Bootstrap utility classes (`d-flex`, `p-3`, `mb-2`, etc.) — use CSS module classes with tokens |
| **No `composes`** | Do not use the CSS Modules `composes` keyword — use tokens directly |
| **`color-mix` for transparency** | Use `color-mix(in srgb, var(--color-*) <percentage>, transparent)` instead of `rgba`/`hsla` |
| **Raw breakpoints in `@media`** | CSS custom properties do not work in `@media` conditions — hard-code the pixel value |
| **Add missing tokens** | If a token doesn't exist, add it in `src/style/tokens/` following the naming conventions |
