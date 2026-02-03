---
id: linting-guidelines
title: Linting Guidelines
slug: /developer-resources/linting
sidebar_position: 25
---

## Introduction

This repository uses a comprehensive ESLint configuration with custom rules to maintain code quality, enforce best practices, and catch potential issues early in development. Our modular ESLint setup includes both standard rules and custom rules tailored to our project's specific needs.

The ESLint configuration is located in `eslint.config.js` and uses modular configs from `scripts/eslint/config/`.

## Custom ESLint Rules

### prefer-crud-modal-template

This rule encourages the use of `CRUDModalTemplate` over `BaseModal` when building modals that contain CRUD (Create, Read, Update, Delete) functionality.

**Rule Location:** `scripts/eslint/rules/prefer-crud-modal-template.ts`

#### When This Rule Triggers

The rule flags `BaseModal` usage in these scenarios:

1. **CRUD Handler Props:** When the modal has props that indicate CRUD operations:
   - `onSubmit`
   - `onConfirm` 
   - `onPrimary`
   - `onSave`

2. **Form Elements:** When the modal contains `<form>` or `<Form>` elements in its children.

#### Examples

**Incorrect - Using BaseModal with CRUD props:**
```tsx
import { BaseModal } from 'shared-components/BaseModal';

function UserEditModal() {
  return (
    <BaseModal 
      isOpen={true} 
      onSubmit={handleSubmit} // CRUD handler prop
      title="Edit User"
    >
      <form>
        <input name="username" />
        <button type="submit">Save</button>
      </form>
    </BaseModal>
  );
}
```

**Incorrect - Using BaseModal with form elements:**
```tsx
import { BaseModal } from 'shared-components/BaseModal';

function CreatePostModal() {
  return (
    <BaseModal isOpen={true} title="Create Post">
      <Form onSubmit={handleSubmit}> {/* Form element detected */}
        <input name="title" />
        <textarea name="content" />
      </Form>
    </BaseModal>
  );
}
```

**Correct - Using CRUDModalTemplate:**
```tsx
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';

function UserEditModal() {
  return (
    <CRUDModalTemplate 
      isOpen={true} 
      onSubmit={handleSubmit}
      title="Edit User"
    >
      <form>
        <input name="username" />
        <button type="submit">Save</button>
      </form>
    </CRUDModalTemplate>
  );
}
```

#### Configuration Options

The rule can be customized with these options:

```javascript
// eslint.config.js
{
  'custom-rules/prefer-crud-modal-template': ['error', {
    keywords: ['onSubmit', 'onConfirm', 'onPrimary', 'onSave'], // Default
    variants: ['BaseModal'], // Default
    ignorePaths: ['src/test/**'], // Files to ignore
    importPathPatterns: ['**/BaseModal'] // Custom import patterns
  }]
}
```

#### Auto-fix Capability

This rule provides automatic fixes that:
- Replace `BaseModal` imports with `CRUDModalTemplate` 
- Preserve other imports when multiple components are imported from the same module
- Handle both default and named imports
- Maintain import aliases

#### Benefits

1. **Consistency:** Ensures CRUD modals use the standardized template
2. **Best Practices:** Enforces proper component usage patterns  
3. **Maintainability:** Makes CRUD modal code more predictable and easier to maintain
4. **Developer Experience:** Provides real-time feedback and automatic fixes in your IDE

## Disabling ESLint Rules

While ESLint rules are designed to maintain code quality, there are rare cases where you may need to disable them. Use these guidelines responsibly and sparingly.

### Inline Disabling

**Disable a specific rule for the next line:**
```tsx
// es‌lint-disable-next-line custom-rules/prefer-crud-modal-template
<BaseModal onSubmit={handleSubmit}>
```

**Disable multiple rules for the next line:**
```tsx
// es‌lint-disable-next-line custom-rules/prefer-crud-modal-template, no-restricted-imports
import { BaseModal } from 'shared-components/BaseModal';
```

**Disable a rule for the current line:**
```tsx
<BaseModal onSubmit={handleSubmit}> {/* es‌lint-disable-line custom-rules/prefer-crud-modal-template */}
```

### Block Disabling

**Disable rules for a block of code:**
```tsx
/* es‌lint-disable custom-rules/prefer-crud-modal-template */
function LegacyModal() {
  return (
    <BaseModal onSubmit={handleSubmit}>
      <form>...</form>
    </BaseModal>
  );
}
/* es‌lint-enable custom-rules/prefer-crud-modal-template */
```

### File-level Disabling

**Disable rules for an entire file (add at the top):**
```tsx
/* es‌lint-disable custom-rules/prefer-crud-modal-template */

// Rest of your file...
```

**Disable all ESLint rules for a file:**
```tsx
/* es‌lint-disable */

// Rest of your file...
```

### Best Practices for Disabling Rules

1. **Always include a comment explaining why** you're disabling the rule:
   ```tsx
   // Legacy component that will be refactored in next sprint  
   // es‌lint-disable-next-line custom-rules/prefer-crud-modal-template
   <BaseModal onSubmit={handleSubmit}>
   ```

2. **Use the most specific disable possible** - prefer `eslint-disable-next-line` over broader disables

3. **Consider refactoring instead** - if you find yourself disabling rules frequently, the code might need restructuring

4. **Document technical debt** - create GitHub issues for code that needs future refactoring when rules are disabled

### When Disabling is Acceptable

- **Legacy code** during gradual migration
- **Third-party library compatibility** issues
- **Test files** with specific testing patterns

### When NOT to Disable

- **Convenience** - don't disable rules just because they're inconvenient
- **Security rules** - never disable security-related rules without team approval
- **Style preferences** - the linting rules represent agreed-upon team standards

## Running Lint Checks

To run ESLint checks on your code:

```bash
# Check for linting issues
pnpm run lint:check

# Auto-fix issues where possible
pnpm run lint:fix
```