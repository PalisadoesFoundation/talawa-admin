---
id: reusable-components
title: Reusable Components
slug: /developer-resources/reusable-components
sidebar_position: 35
---

Shared components are UI and functional elements used across multiple sections of the application.

This guide outlines how to create and manage these components to ensure a unified design system and efficient code reuse.

## Quick reference

1. Admin UI:
   ```
   src/components/AdminPortal/**
   src/types/AdminPortal/**
   ```
1. User UI
   ```
   src/components/UserPortal/**
   src/types/UserPortal/**
   ```
1. Shared UI
   ```
   src/shared-components/**
   src/types/shared-components/**
   ```
1. Props definitions
   - interface.ts only (no inline interfaces)
1. Exports
   - PascalCase, name matches folder/file
1. Tests
   - colocated .spec.tsx
   - target 100% test code coverage
1. i18n
   - all user-visible text uses keys

1. TSDoc
   - brief headers on components and interfaces

## Component Architecture

It's important to understand structure and behavior of shared components before creating or refactoring them.

### Folder Layout

Use the following path structure for shared components.

```
src/
  components/
    AdminPortal/                    # Admin-only UI and hooks
      UserTableRow/
        UserTableRow.tsx
        UserTableRow.spec.tsx
      hooks/
        useCursorPagination.ts
        useCursorPagination.spec.ts
    UserPortal/                     # User-only UI and hooks
      ...
  shared-components/                # Shared UI (kebab-case base, PascalCase children)
    ProfileAvatarDisplay/
      ProfileAvatarDisplay.tsx
      ProfileAvatarDisplay.spec.tsx
    BaseModal/
      BaseModal.tsx
      BaseModal.spec.tsx
    EmptyState/
      EmptyState.tsx
      EmptyState.spec.tsx
    LoadingState/
      LoadingState.tsx
      LoadingState.spec.tsx
  types/
    AdminPortal/                    # Admin-only types
      UserTableRow/
        interface.ts
      Pagination/
        interface.ts
    UserPortal/                     # User-only types (as needed)
      ...
    shared-components/              # Shared types mirror components
      ProfileAvatarDisplay/
        interface.ts
      BaseModal/
        interface.ts
      EmptyState/
        interface.ts
      LoadingState/
        interface.ts
```

### Rationale

There are many reasons for this structure:

1. Clear ownership: Admin vs User portal code is easy to find.

2. Reuse with intent: Truly shared UI lives in one place.

3. Safer changes: Portal-specific changes can’t silently affect the other portal.

4. Faster onboarding and reviews: Predictable paths and conventions.

### Placement Rules

1. Admin-only UI

   ```
   src/components/AdminPortal/** (types in src/types/AdminPortal/**).
   ```

2. User-only UI
   ```
   src/components/UserPortal/** (types in src/types/UserPortal/**).
   ```
3. Shared UI used by both portals
   ```
   src/shared-components/** (types in src/types/shared-components/**).
   ```
4. Portal-specific hooks live under that portal (e.g., AdminPortal/hooks). Promote to shared only when used by both portals.

### Naming Conventions

1. Use PascalCase for component and folder names (e.g., `OrgCard`, `Button`).
   1. The `types/shared-components` folder is the sole exception
2. The component files should be PascalCase and the name should match the component (e.g., `OrgCard.tsx`, `Button.tsx`).
3. Tests should be named `Component.spec.tsx`.
4. Mock files should follow `ComponentMock.ts`.
5. Type interface should be defined in corresponding interface / type file.
   - For example: `src/types/\<Portal or shared-components\>/\<Component\>/interface.ts` (single source of truth for props; no inline prop interfaces).

     ```
     src/
     │
     ├── types/
         └── AdminPortal
             ├── Component
                 └── interface.ts
                 └── type.ts
     ```

### Imports (examples)

```ts
// shared
import { ProfileAvatarDisplay } from '/shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

// admin
import { UserTableRow } from 'components/AdminPortal/UserTableRow/UserTableRow';
```

## Wrapper Components and Restricted Imports

Some shared components are wrappers around third-party UI libraries. To enforce consistent usage, direct imports from those libraries are restricted by ESLint, and only the wrapper implementations may import them.

### What is restricted (and what to use instead)

- `@mui/x-data-grid` and `@mui/x-data-grid-pro` -> use `DataGridWrapper`
- `react-bootstrap` `Spinner` -> use `LoadingState`
- `react-bootstrap` `Modal` -> use `BaseModal`
- `@mui/x-date-pickers` -> use `DateRangePicker`, `DatePicker`, or `TimePicker`

These restrictions are enforced by `no-restricted-imports` in `eslint.config.js`.

### Where direct imports are allowed

Direct imports are only allowed inside the wrapper component implementations. The ESLint config defines a central registry of restricted imports and then allows specific IDs per folder.

```js
const restrictedImports = [
  { id: 'mui-data-grid', name: '@mui/x-data-grid', message: '...' },
  { id: 'mui-data-grid-pro', name: '@mui/x-data-grid-pro', message: '...' },
  {
    id: 'rb-spinner',
    name: 'react-bootstrap',
    importNames: ['Spinner'],
    message: '...',
  },
  {
    id: 'rb-modal',
    name: 'react-bootstrap',
    importNames: ['Modal'],
    message: '...',
  },
  { id: 'mui-date-pickers', name: '@mui/x-date-pickers', message: '...' },
];

const restrictImportsExcept = (allowedIds = []) => ({
  'no-restricted-imports': [
    'error',
    {
      paths: restrictedImports
        .filter(({ id }) => !allowedIds.includes(id))
        .map(({ id, ...rule }) => rule),
    },
  ],
});
```

Allowed IDs by folder:

- DataGridWrapper: `mui-data-grid`, `mui-data-grid-pro`
  - `src/shared-components/DataGridWrapper/**`
  - `src/types/DataGridWrapper/**`
- LoadingState/Loader: `rb-spinner`
  - `src/shared-components/LoadingState/**`
  - `src/types/shared-components/LoadingState/**`
  - `src/components/Loader/**`
- BaseModal: `rb-modal`
  - `src/shared-components/BaseModal/**`
  - `src/types/shared-components/BaseModal/**`
- Date pickers: `mui-date-pickers`
  - `src/shared-components/DateRangePicker/**`
  - `src/types/shared-components/DateRangePicker/**`
  - `src/shared-components/DatePicker/**`
  - `src/shared-components/TimePicker/**`
  - `src/index.tsx`

### Adding a new restricted import or wrapper

1. Add a new entry to `restrictedImports` in `eslint.config.js` with a unique `id`, `name`, and `message`.
2. Allow that ID in the wrapper folder override using `restrictImportsExcept([...])`.
3. Update this document to list the new restriction and allowed folder(s).

### Troubleshooting

If you see an error like:

```
'@mui/x-data-grid' import is restricted from being used. ...
```

it means you are importing a restricted library outside the allowed wrapper folders. Switch to the shared wrapper component or update the ESLint exception only if you are building the wrapper itself.

### i18n

1. All screen-visible text must use translation keys. No hardcoded strings.
1. Provide alt text and aria labels via i18n where user-facing.

Example:

```tsx
<BaseModal
  title={t('members.remove_title')}
  confirmLabel={t('common.confirm')}
  cancelLabel={t('common.cancel')}
/>
```

### TSDoc Documentation

Add a brief TSDoc header to:

1. Each component: what it does, key behaviors, important a11y notes.
1. Each interface.ts: props with short descriptions and defaults.

Example:

```ts
/**
 * ProfileAvatarDisplay renders a user’s image or initials fallback.
 * - Sizes: small | medium | large | custom
 * - A11y: always sets meaningful alt; handles broken image fallback
 */
```

### Accessibility (a11y) essentials

1. Images: meaningful alt; fallback to initials when URL is empty/invalid.
1. Modals: role="dialog", aria-modal, labelled by title; focus trap; Escape to close.
1. Buttons/links: accessible names; keyboard operable.

## Understanding Components Reuse

Learn how shared components are integrated and reused across different areas of the application.

### Props Driven Design

Props-driven design focuses on building components that adapt their behavior, appearance, and content based on the props rather than hardcoded values. This approach increases flexibility and reusability, allowing the same component to serve multiple purposes across the application. By passing data, event handlers, and configuration options through props.

```tsx
import React from 'react';
import styles from 'style/app-fixed.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
}) => {
  const variantStyle =
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton;

  return (
    <button
      onClick={onClick}
      className={`${styles.buttonStyle} ${variantStyle}`}
    >
      {label}
    </button>
  );
};

export default Button;
```

### Handling Role Based Differences

In some cases, a shared component needs to behave differently depending on the user's role. Instead of creating separate components for each role, you can handle variations through props. This ensures a single, maintainable source while keeping the UI consistent.

For example, the `OrgCard` component below adjusts its rendering based on the `role` and `isMember` props:

- If role is `admin`, it shows the Manage button instead and displays admin-specific details.
- If user is `member`, it shows a visit button.
- If user is `Not a member`, it shows a join button.

```tsx
import React from 'react';
import styles from 'style/app-fixed.module.css';
import InterfaceOrgCardProps from 'src/types/Organization/interface.ts';

const OrgCard: React.FC<InterfaceOrgCardProps> = ({
  name,
  address,
  membersCount,
  adminsCount,
  role,
  isMember,
}) => {
  return (
    <div className={styles.orgCard}>
      <div>
        <h3 className="font-semibold text-lg">{name}</h3>
        {role === 'admin' && adminsCount !== undefined && (
          <p className="text-sm text-gray-600">Admins: {adminsCount}</p>
        )}
        <p className="text-sm text-gray-600">Members: {membersCount}</p>
        <p className="text-sm text-gray-500">{address}</p>
      </div>

      <button onClick={handleClick} className={styles.orgCardButton}>
        {role === 'admin' ? 'Manage' : isMember ? 'Visit' : 'Join'}
      </button>
    </div>
  );
};

export default OrgCard;
```

## Existing Shared Components

Below are some commonly used shared components available in the codebase.

## EmptyState

`EmptyState` is a reusable shared component for displaying consistent empty, no-data, or no-result states across the application.  
It replaces legacy `.notFound` CSS-based implementations and standardizes empty UI patterns.

#### Component Location

```text
src/shared-components/EmptyState/
```

**Use cases:**

- No search results
- Empty lists or tables
- No organizations / users / events
- First-time onboarding states

**Key features:**

- Optional icon, description, and action button
- Built-in accessibility (`role="status"`, `aria-label`)
- i18n-ready (supports translation keys and plain strings)
- Fully tested with 100% coverage

**Example usage:**

```tsx
import EmptyState from 'src/shared-components/EmptyState/EmptyState';

<EmptyState
  message="noResults"
  description="tryAdjustingFilters"
  icon="person_off"
  action={{
    label: 'createNew',
    onClick: handleCreate,
    variant: 'primary',
  }}
/>;
```

#### When to Use EmptyState

_Use EmptyState for:_

- Empty lists or tables
- No search results
- No organizations, users, or events
- First-time or onboarding states
- Filtered results returning no data

_Do not use EmptyState for:_

- 404 or route-level errors (use NotFound instead)

### Component API

Import

```ts
import EmptyState from 'src/shared-components/EmptyState/EmptyState';
```

#### Props

| Prop          | Type                  | Required | Description                                |
| ------------- | --------------------- | -------- | ------------------------------------------ |
| `message`     | `string`              | Yes      | Primary message (i18n key or plain string) |
| `description` | `string`              | No       | Secondary supporting text                  |
| `icon`        | `string \| ReactNode` | No       | Icon name or custom icon component         |
| `action`      | `object`              | No       | Optional action button configuration       |
| `className`   | `string`              | No       | Custom CSS class                           |
| `dataTestId`  | `string`              | No       | Test identifier                            |

#### Action Prop Shape

```ts
interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
}
```

### Usage Example

**1. Simple Empty State:**

```tsx
<EmptyState message="noDataFound" />
```

**2. Empty State With Icon:**

```tsx
<EmptyState
  icon="groups"
  message="noOrganizationsFound"
  description="createOrganizationToGetStarted"
/>
```

**3. Search Empty State:**

```tsx
<EmptyState
  icon="search"
  message="noResultsFound"
  description={tCommon('noResultsFoundFor', {
    query: searchTerm,
  })}
/>
```

**4. Empty State With Action Button:**

```tsx
<EmptyState
  icon="person_off"
  message="noUsersFound"
  description="inviteUsersToGetStarted"
  action={{
    label: 'inviteUser',
    onClick: handleInvite,
    variant: 'primary',
  }}
/>
```

### ErrorBoundaryWrapper

`ErrorBoundaryWrapper` is a error boundary component that catches JavaScript errors in child components, logs them, and displays a fallback UI instead of crashing the entire application.

**Use cases:**

- Wrapping critical components that might throw render errors
- Protecting modals, forms, and complex UI sections
- Providing graceful error recovery for users
- Integrating with error tracking services (e.g., Sentry, LogRocket)

**Key features:**

- Catches render errors that try-catch cannot handle
- Provides default and custom fallback UI options
- Integrates with toast notification system
- Supports error recovery via reset mechanism
- Allows error logging/tracking integration
- Fully accessible (keyboard navigation, screen reader support)
- Fully tested with 100% coverage

**Example usage:**

```tsx
import { ErrorBoundaryWrapper } from 'src/shared-components/ErrorBoundaryWrapper';

// Basic usage with default fallback
<ErrorBoundaryWrapper>
  <YourComponent />
</ErrorBoundaryWrapper>

// With custom error message and logging
<ErrorBoundaryWrapper
  errorMessage={t('errors.defaultErrorMessage')}
  onError={(error, info) => logToService(error, info)}
  onReset={() => navigate('/dashboard')}
>
  <ComplexModal />
</ErrorBoundaryWrapper>

// Default fallback with custom i18n strings
<ErrorBoundaryWrapper
  fallbackTitle={t('errors.title')}
  fallbackErrorMessage={t('errors.defaultErrorMessage')}
  resetButtonText={t('errors.resetButton')}
  resetButtonAriaLabel={t('errors.resetButtonAriaLabel')}
>
  <ComplexModal />
</ErrorBoundaryWrapper>

// With custom fallback component
const CustomErrorFallback = ({ error, onReset }) => (
  <div>
    <h2>Custom Error UI</h2>
    <p>{error?.message}</p>
    <button onClick={onReset}>Retry</button>
  </div>
);

<ErrorBoundaryWrapper fallbackComponent={CustomErrorFallback}>
  <Modal />
</ErrorBoundaryWrapper>

// With custom JSX fallback
<ErrorBoundaryWrapper
  fallback={<div>Something went wrong. Please refresh.</div>}
>
  <ComplexForm />
</ErrorBoundaryWrapper>

// Disable toast notifications
<ErrorBoundaryWrapper showToast={false}>
  <Component />
</ErrorBoundaryWrapper>
```

#### Props

| Prop                   | Type                                               | Required | Description                                                         |
| ---------------------- | -------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| `children`             | `ReactNode`                                        | Yes      | Child components to wrap with error boundary                        |
| `fallback`             | `ReactNode`                                        | No       | Custom JSX fallback UI                                              |
| `fallbackComponent`    | `React.ComponentType<InterfaceErrorFallbackProps>` | No       | Custom fallback component that receives `error` and `onReset` props |
| `errorMessage`         | `string`                                           | No       | Custom error message for toast notification                         |
| `showToast`            | `boolean`                                          | No       | Whether to show toast notification (default: `true`)                |
| `onError`              | `function`                                         | No       | Callback invoked when error is caught                               |
| `onReset`              | `function`                                         | No       | Callback invoked when user clicks reset button                      |
| `fallbackTitle`        | `string`                                           | No       | Custom error message for default UI                                 |
| `fallbackErrorMessage` | `string`                                           | No       | Custom error message for default UI                                 |
| `resetButtonText`      | `string`                                           | No       | Custom error message for default UI                                 |
| `resetButtonAriaLabel` | `string`                                           | No       | Custom error message for default UI                                 |

**Accessibility:**

- Default fallback includes `role="alert"` and `aria-live="assertive"`
- Reset button is keyboard accessible (Enter and Space keys)
- Screen reader friendly error messages
- High contrast and dark mode support

### Relationship with Loading States

- Use LoadingState while data is being fetched
- Render EmptyState only after loading completes
- Never show EmptyState during an active loading state

### Migration Guidance

- Legacy `.notFound` CSS patterns are deprecated
- All new empty-state implementations must use EmptyState
- Existing screens should be migrated incrementally

## FormFieldGroup

`FormFieldGroup` is a small set of reusable form components built to standardize labels, validation messages, help text, and accessibility across the application.
​
It includes a base wrapper (`FormFieldGroup`) plus field-specific components (`text`, `textarea`, `select`, `checkbox`, `radio group`, and `date picker`).

#### Component Location

```text
src/shared-components/FormFieldGroup/
```

**Use case:**

- Building consistent Bootstrap form rows with shared label + error + help text behavior.
- Building Material UI fields (`TextField`/`Autocomplete`/`DatePicker`) with a consistent `touched` + `error` API.
- Ensuring form errors are properly connected to inputs via `aria-describedby`/`aria-invalid`.

**Key Features:**

- Shared wrapper that renders label, required indicator, error feedback, and help text in one place.
- Automatic ARIA injection: when `touched` + `error` are present, children receive `aria-invalid` and `aria-describedby` pointing to the rendered error element.
- Supports both React-Bootstrap and Material UI field implementations under the same “FormFieldGroup family”.
- Fully tested coverage across wrapper behavior + each field type + integration scenarios.

**Example usage:**

```tsx
//FormTextField is a part of FormFIeldGroup components
<FormTextField
  format="mui"
  name="username"
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  touched={touched}
  error={error}
/>
```

#### When to use FormFieldGroup and its components

_Use FormFieldGroup components for:_

- Screen-level forms (user-facing pages, modals, wizards)
- Any form requiring consistent label + error + help text layout
- Ensuring proper ARIA error association across form fields

_Do not use FormFieldGroup components for:_

- Unit tests of individual field components (FormTextField, FormSelect, etc.)
- Simple standalone inputs without validation/label requirements
- Internal component composition/testing scenarios

### Component API

Import

```tsx
import {
  FormFieldGroup,
  FormTextField,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  FormDateField,
} from 'src/shared-components/FormFieldGroup';
```

These exports are provided from the package `index.ts`.

#### Props

**1. ICommonInputProps**

| Prop      | Type                                               | Required | Description                |
| --------- | -------------------------------------------------- | -------- | -------------------------- |
| value     | `string`                                           | Yes      | Current value of the input |
| onChange  | `(e: React.ChangeEvent<HTMLInputElement>) => void` | No       | Change handler for input   |
| error     | `boolean`                                          | No       | Indicates error state      |
| required  | `boolean`                                          | No       | Marks field as required    |
| disabled  | `boolean`                                          | No       | Disables the input         |
| onFocus   | `() => void`                                       | No       | Focus event handler        |
| onBlur    | `() => void`                                       | No       | Blur event handler         |
| className | `string`                                           | No       | Custom CSS class           |

**2. IBootstrapTextFieldProps**

| Prop          | Type                                                            | Required | Description                        |
| ------------- | --------------------------------------------------------------- | -------- | ---------------------------------- |
| type          | `'text' \| 'email' \| 'password' \| 'number' \| 'url' \| 'tel'` | No       | HTML input type                    |
| placeholder   | `string`                                                        | No       | Placeholder text                   |
| maxLength     | `number`                                                        | No       | Maximum character length           |
| showCharCount | `boolean`                                                       | No       | Shows character counter            |
| autoComplete  | `string`                                                        | No       | Browser autocomplete hint          |
| controlClass  | `string`                                                        | No       | Bootstrap control class            |
| data-\*       | `string \| number`                                              | No       | Custom data attributes for testing |

**3. IMuiFieldProps**

| Prop         | Type                | Required | Description                  |
| ------------ | ------------------- | -------- | ---------------------------- |
| variant      | `TextFieldVariants` | No       | MUI TextField variant        |
| endAdornment | `React.ReactNode`   | No       | Icon or element at input end |

**4. IFormFieldGroupProps**

| Prop            | Type                | Required | Description                         |
| --------------- | ------------------- | -------- | ----------------------------------- |
| name            | `string`            | No       | Field name                          |
| label           | `string`            | No       | Display label                       |
| ariaLabel       | `string`            | No       | Accessibility label                 |
| ariaDescribedBy | `string`            | No       | Accessibility description reference |
| groupClass      | `string`            | No       | Wrapper CSS class                   |
| labelClass      | `string`            | No       | Label CSS class                     |
| error           | `string \| boolean` | No       | Error message or state              |
| touched         | `boolean`           | No       | Indicates field interaction         |
| helpText        | `string`            | No       | Helper text below field             |
| required        | `boolean`           | No       | Marks field as required             |

**5. IFormTextFieldProps**

| Prop   | Type                   | Required | Description              |
| ------ | ---------------------- | -------- | ------------------------ |
| format | `'bootstrap' \| 'mui'` | Yes      | Rendering framework      |
| error  | `string`               | No       | Validation error message |

_Note: Includes all inherited Bootstrap + MUI + common props_

**6. IFormTextAreaProps**

| Prop      | Type                | Required | Description            |
| --------- | ------------------- | -------- | ---------------------- |
| name      | `string`            | No       | Name of the text Area  |
| multiline | `true`              | Yes      | Forces multiline       |
| rows      | `number`            | No       | Number of visible rows |
| label     | `string`            | No       | Field label            |
| error     | `string \| boolean` | No       | Error state/message    |
| touched   | `boolean`           | No       | Interaction state      |
| helpText  | `string`            | No       | Helper text            |
| required  | `boolean`           | No       | Required indicator     |
| variant   | `TextFieldVariants` | No       | MUI variant            |
| ariaLabel | `string`            | No       | Accessibility label    |

_Note: Includes all inherited MUI + common props_

**7. IFormSelectProps**

| Prop                  | Type                                       | Required | Description                         |
| --------------------- | ------------------------------------------ | -------- | ----------------------------------- |
| options               | `InterfaceUserInfo[]`                      | No       | Selectable options                  |
| value                 | `InterfaceUserInfo \| InterfaceUserInfo[]` | No       | Selected value(s)                   |
| multiple              | `boolean`                                  | No       | Enables multi-select                |
| limitTags             | `number`                                   | No       | Tag display limit                   |
| isOptionEqualToValue  | `(option, value) => boolean`               | No       | Option comparison                   |
| filterSelectedOptions | `boolean`                                  | No       | Hides selected options              |
| getOptionLabel        | `(option) => string`                       | No       | Label extractor                     |
| onChange              | `(event, value) => void`                   | No       | Change handler                      |
| renderInput           | `(params) => React.ReactNode`              | No       | Custom input renderer               |
| label                 | `string`                                   | No       | Field label                         |
| name                  | `string`                                   | No       | Name of the Select field            |
| error                 | `string \| boolean`                        | No       | Error state/message                 |
| required              | `boolean`                                  | No       | Required indicator                  |
| touched               | `boolean`                                  | No       | Interaction state                   |
| helpText              | `string`                                   | No       | Helper text                         |
| ariaLabel             | `string`                                   | No       | Accessibility label                 |
| ariaDescribedBy       | `string`                                   | No       | Accessibility description reference |

_Note: Includes all inherited common props_

**8. IFormCheckBoxProps**

| Prop           | Type                             | Required | Description       |
| -------------- | -------------------------------- | -------- | ----------------- |
| type           | `'checkbox'`                     | No       | Input type        |
| labelText      | `string`                         | No       | Checkbox label    |
| labelProps     | `LabelHTMLAttributes`            | No       | Label attributes  |
| containerClass | `string`                         | No       | Wrapper CSS class |
| containerProps | `HTMLAttributes<HTMLDivElement>` | No       | Wrapper props     |
| touched        | `boolean`                        | No       | Interaction state |
| error          | `string`                         | No       | Error message     |

_Note: Includes all inherited FormCheckProp (Bootstrap) + common props_

**9. IFormRadioGroupProps**

| Prop       | Type                                   | Required | Description       |
| ---------- | -------------------------------------- | -------- | ----------------- |
| type       | `'radio'`                              | No       | Input type        |
| name       | `string`                               | No       | Radio group name  |
| id         | `string`                               | No       | Group ID          |
| label      | `string`                               | No       | Group label       |
| options    | `{ label: string; value: string }[]`   | Yes      | Radio options     |
| checked    | `boolean`                              | No       | Checked state     |
| onChange   | `ChangeEventHandler<HTMLInputElement>` | No       | Change handler    |
| error      | `string`                               | No       | Error message     |
| touched    | `boolean`                              | No       | Interaction state |
| groupClass | `string`                               | No       | Wrapper CSS class |
| labelClass | `string`                               | No       | Label CSS class   |

_Note: Includes all inherited FormCheckProp (Bootstrap) + common props_

**10. IFormDateFieldProps**

| Prop      | Type             | Required | Description            |
| --------- | ---------------- | -------- | ---------------------- |
| value     | `Dayjs \| null`  | Yes      | Selected date          |
| onChange  | `(date) => void` | Yes      | Date change handler    |
| format    | `string`         | No       | Display format         |
| minDate   | `Dayjs`          | No       | Minimum date           |
| maxDate   | `Dayjs`          | No       | Maximum date           |
| disabled  | `boolean`        | No       | Disables picker        |
| readOnly  | `boolean`        | No       | Read-only mode         |
| className | `string`         | No       | Custom CSS class       |
| slotProps | `object`         | No       | MUI slot customization |
| label     | `string`         | No       | Field label            |
| name      | `string`         | No       | Date field name        |
| error     | `boolean`        | No       | Error state            |
| required  | `boolean`        | No       | Required indicator     |
| touched   | `boolean`        | No       | Interaction state      |
| helpText  | `string`         | No       | Helper text            |

### Usage Example

**1.Basic wrapper usage (Bootstrap)**

```tsx
import { FormFieldGroup } from 'src/shared-components/FormFieldGroup';

<FormFieldGroup
  name="email"
  label="Email"
  touched={touched.email}
  error={errors.email}
  helpText="We’ll never share your email."
  required
>
  {children}
</FormFieldGroup>;
```

`FormFieldGroup` will attach an `id` and wire up error ARIA attributes automatically when an error is shown.

_Note: Children can not be part of default Form component_

**2. Text field (Bootstrap or MUI)**

```tsx
import { FormTextField } from 'src/shared-components/FormFieldGroup';

// Bootstrap format
<FormTextField
  format="bootstrap"
  name="username"
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  touched={touched}
  error={error}
  showCharCount
  maxLength={30}
/>;

// MUI format
<FormTextField
  format="mui"
  name="username"
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  touched={touched}
  error={error}
/>;
```

`FormTextField` supports optional `endAdornment` and optional character counting when `showCharCount` is enabled and `maxLength` is provided.

**3. Select (MUI Autocomplete)**

```tsx
import { FormSelect } from 'src/shared-components/FormFieldGroup';
import TextField from '@mui/material/TextField';

<FormSelect
  name="user"
  label="Select user"
  options={users}
  value={selectedUser}
  onChange={(_, next) => setSelectedUser(next)}
  getOptionLabel={(u) => u.name}
  touched={touched}
  error={error}
  renderInput={(params) => <TextField {...params} />}
/>;
```

`FormSelect` is built on MUI `Autocomplete`, supports `multiple`, `limitTags`, and `filterSelectedOptions`, and maps `touched` + `error` into `helperText`.

### Field components

- `FormTextField`: Text input supporting `format="bootstrap"` (uses `FormFieldGroup`) or `format="mui"` (uses MUI TextField).
- `FormTextArea`: MUI multiline input with `rows`, `endAdornment`, and `aria-invalid` when error is shown.
- `FormSelect`: MUI `Autocomplete` wrapper supporting single/multiple selection and passing ARIA attributes through to the underlying input.
- `FormCheckbox`: Bootstrap checkbox with error feedback and `aria-describedby` wired to the error element.
- `FormRadioGroup`: Bootstrap radios rendered from an `options` array and wrapped in `FormFieldGroup`.
- `FormDateField`: MUI X `DatePicker` wrapped in `LocalizationProvider` with `AdapterDayjs`.

### Accessibility notes

- `FormFieldGroup` links errors to inputs by generating a stable error element id (`${fieldId}-error`) and injecting `aria-describedby` + `aria-invalid` into children when `touched` + `error` are truthy.
- `FormCheckbox` also sets `aria-describedby` to its own error feedback when invalid.
- Tests include keyboard navigation and validation announcement behaviors to prevent regressions.

## Creating Shared Components

This section provides guidance on our shared components policy.

### When Not to Create a Shared Component

Avoid placing a component in the shared folder if:

- It's used in only one screen or context.
- The design is too unique to be reused elsewhere.

Instead, keep such components in their specific module.

### When to Create a Shared Component

Create a shared component if:

- It's being used at multiple places.
- Only props differ, not the core layout or logic.
- It represents a common design pattern (like a card, button, etc.).
- It's likely to be used in the future.

### Defining a Strict Props Structure

Each shared component must define a clear, typed interface for its props, placed in a corresponding `interface.ts` file.

#### Why Strict Typing Matters

Strict typing is crucial when building reusable components, as these components are meant to be used across different modules, teams, and contexts. By defining clear and specific TypeScript interfaces for props, you ensure that each component communicates exactly what is expected and how it should behave, eliminating ambiguity for other developers who reuse it.

Type props act as a form of self-documentation, providing instant clarity through autocompletion and inline hints when a component is imported elsewhere. This helps prevent misuse, such as passing unsupported data or missing required props, which can lead to inconsistent UI behavior.

It also ensures that any changes in shared components are propagated safely, with TypeScript catching any incompatible usage at build time instead of letting them cause runtime errors. Ultimately, strict typing keeps your reusable code reliable, maintainable, and predictable, ensuring that they behave consistently wherever they are used in the project.

#### Key Rules

- Always use TypeScript interfaces, avoid using `any`.
- Avoid passing entire objects, instead destructure and pass only required fields.
- Each prop should serve a single purpose (data, action, or style control).
- Use clear, descriptive prop names like `isMember`, `variant`, or `role` instead of generic terms like `flag` or `type`.

#### Examples

1. **Role based props:** When a component behaves differently for user types (admin / user), define a `role` prop to handle that difference cleanly.

   ```typescript
   interface InterfaceOrgCardProps {
     name: string;
     address: string;
     membersCount: number;
     adminsCount?: number;
     role: 'admin' | 'user';
     isMember?: boolean;
   }
   ```

1. **Variant based props:** For components with multiple design or behavior styles (like buttons or cards), define a `variant` prop.

   ```typescript
   interface ButtonProps {
     label: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary' | 'outlined';
   }
   ```

   - The `variant` prop helps the component adapt its appearance dynamically:
     1. `primary` → For main action on a page (example: Save, Submit).
     2. `secondary` → For supporting action (example: Cancel, Edit).
     3. `outlined` → For neutral or optional actions (example: Learn more, Back).

### Styling Guidelines

1. Use existing global or shared CSS modules whenever possible to maintain consistency.
1. Avoid inline styles unles necessary for dynamic cases.
1. When defining styles, prefer semantic class names (e.g., `buttonPrimary`, `cardHeader`).

### Testing Shared Component

1. Each shared component must include a corresponding test file (`Component.spec.tsx`)
1. Refer to the [testing page of the documentation website](https://docs-admin.talawa.io/docs/developer-resources/testing)

### Document Your Code

Use TSDoc comments to document functions, classes, and interfaces within reusable components. Clearly describe the component's purpose, its props and any return value. This practice not only improves readability but also helps maintain consistency across shared components, especially when they are used by multiple developers or teams. Well-documented props and behavior makes it easier for others to quickly understand how to use, extend, or debug the component without needing to inspect its internal implementation.

```ts
/**
 * Button Component
 *
 * Reusable button for primary, secondary, or outlined actions across the app.
 *
 * @param {ButtonProps} props - The props for the button.
 * @returns {JSX.Element} The rendered button element.
 *
 * @example
 * <Button label="Save" onClick={handleSave} variant="primary" />
 */
```
