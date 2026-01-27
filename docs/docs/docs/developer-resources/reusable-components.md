---
id: reusable-components
title: Reusable Components
slug: /developer-resources/reusable-components
sidebar_position: 35
---

Shared components are UI and functional elements used across multiple sections of the application.

This guide outlines how to create and manage these components to ensure a unified design system and efficient code reuse.

## Quick reference

1. Screens (routing-level UI)

   ```
   src/screens/Auth/**
   src/screens/Public/**
   src/screens/AdminPortal/**
   src/screens/UserPortal/**
   ```

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
  screens/
    AdminPortal/                    # Admin-only screens
      Users/
        Users.tsx
        Users.spec.tsx
    UserPortal/                     # User-only screens
      Campaigns/
        Canpaigns.stx
        Campaigns.spec.tsx
    Auth/                           # Auth-only screens
      LoginPage/
        LoginPage.tsx
        LoginPage.spec.tsx
    Public/                         # Unauthenticated screens
      Invitation/
        Invitation.tsx
        Invitation.spec.tsx

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

### Screen Placement Rules

  1. Authentication-related screens
        ```
        src/screens/Auth/**
        Examples: Login, ForgotPassword, ResetPassword
        ```
  2. Admin-only screens
        ```
        src/screens/AdminPortal/**
        Examples: Users, CommunityProfile, Notification
        ```
  3. User-only screens
        ```
        src/screens/UserPortal/**
        Examples: Campaigns, Chat, Donate
        ```
  4. Public, unauthenticated screens  
        ```
        src/screens/Public/**
        Examples: Invitation acceptance, PageNotFound, public info pages
        ```

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
- `react-bootstrap` `Button` -> use the shared `Button` wrapper
- `@mui/x-date-pickers` -> use `DateRangePicker`, `DatePicker`, or `TimePicker`
- `react-toastify` -> use `NotificationToast`

These restrictions are enforced by `no-restricted-imports` in `eslint.config.js` (configured in
`scripts/eslint/config/base.ts`) and defined in `scripts/eslint/rules/imports.ts`.

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
- Button wrapper: `rb-button`, `rb-button-path`
  - `src/shared-components/Button/**`
  - `src/types/shared-components/Button/**`
- Date pickers: `mui-date-pickers`
  - `src/shared-components/DateRangePicker/**`
  - `src/types/shared-components/DateRangePicker/**`
  - `src/shared-components/DatePicker/**`
  - `src/shared-components/TimePicker/**`
  - `src/index.tsx`
- NotificationToast: `react-toastify`
  - `src/shared-components/NotificationToast/**`
  - `src/types/shared-components/NotificationToast/**`

### Adding a new restricted import or wrapper

1. Add a new entry to `restrictedImports` in `scripts/eslint/rules/imports.ts` with a unique `id`, `name`, and `message`.
2. Allow that ID in the wrapper folder override using `restrictImportsExcept([...])`.
3. Update this document to list the new restriction and allowed folder(s).

### Troubleshooting

If you see an error like:

```
'@mui/x-data-grid' import is restricted from being used. ...
```

it means you are importing a restricted library outside the allowed wrapper folders. Switch to the shared wrapper component or update the ESLint exception only if you are building the wrapper itself.

## Search Input Restrictions

### Insert Location

Add this section in the **"Wrapper Components and Restricted Imports"** section:

**After:** The "Troubleshooting" subsection (ends with "...or update the ESLint exception only if you are building the wrapper itself.")

**Before:** The "i18n" subsection (starts with "### i18n")

---

### New Section to Add

#### Search Input Components

Direct HTML search inputs are restricted to enforce consistent search UX patterns across the application. Use the standardized search components instead.

##### What is restricted (and what to use instead)

- Direct `<input type="search">` elements → use `SearchBar` or `SearchFilterBar`
- Input elements with search-related attributes (placeholder, name, id, aria-label containing "search", "find", or "query") → use `SearchBar` or `SearchFilterBar`

These restrictions are enforced by `no-restricted-syntax` in `eslint.config.js` (configured in
`scripts/eslint/config/base.ts`) and defined in `scripts/eslint/rules/rules.ts` under `searchInputRestrictions`.

##### Where direct search inputs are allowed

Direct search input implementations are only allowed inside the search component wrappers themselves:
- `src/shared-components/SearchBar/SearchBar.tsx`
- `src/shared-components/SearchFilterBar/SearchFilterBar.tsx`
- `src/shared-components/DataTable/SearchBar.tsx`

The ESLint config exempts these specific files from search input restrictions while maintaining other security restrictions.

##### Available Search Components

**SearchBar**
- Path: `src/shared-components/SearchBar/`
- Use for: Simple standalone search inputs
- Features: Basic search input with consistent styling and accessibility

**SearchFilterBar**
- Path: `src/shared-components/SearchFilterBar/`
- Use for: Search combined with filtering options
- Features: Integrated search and filter controls

**DataTable SearchBar**
- Path: `src/shared-components/DataTable/SearchBar.tsx`
- Use for: Table-specific search functionality
- Features: Search optimized for data table contexts

##### Troubleshooting

If you see an error like:

```
Direct <input type="search"> is not allowed. Use SearchBar or SearchFilterBar components instead.
```

or

```
Input with search-related placeholder detected. Use SearchBar or SearchFilterBar components for search functionality.
```

it means you are attempting to create a search input outside the allowed wrapper components. Switch to using `SearchBar` or `SearchFilterBar` instead, or update the ESLint exception only if you are building a new search wrapper component itself.

##### Rationale

This restriction ensures:
1. **Consistent UX**: All search inputs behave and appear the same across the application
2. **Accessibility**: Search components include proper ARIA labels, roles, and keyboard navigation
3. **Maintainability**: Search behavior changes only need to be made in one place
4. **Best practices**: Prevents ad-hoc search implementations that may lack proper debouncing, validation, or accessibility features

##### Adding a new search component wrapper

If you need to create a new search component wrapper:

1. Create the component in `src/shared-components/YourSearchComponent/`
2. Add an exemption in `scripts/eslint/config/exemptions.ts`:
   ```javascript
   {
     files: [
       'src/shared-components/YourSearchComponent/YourSearchComponent.tsx',
     ],
     rules: {
       'no-restricted-syntax': ['error', ...securityRestrictions],
     },
   }
   ```
3. Update this documentation to list the new search component
4. Ensure the component follows accessibility guidelines and includes proper TypeScript interfaces

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

## Shared Button wrapper

- Path: `src/shared-components/Button/Button.tsx` (barrel at `src/shared-components/Button/index.ts`).
- Import: `import { Button } from 'shared-components/Button';`.
- Features: wraps `react-bootstrap/Button`, supports common variants (primary/secondary/success/ danger/warning/info/dark/light/outline-*; aliases `outlined`/`outline` map to `outline-primary`), sizes `sm`/`md`/`lg`/`xl`, full-width layout, loading state (`isLoading`, `loadingText`), optional icons with `iconPosition`, and forwards all other bootstrap button props.
- Lint: direct imports from `react-bootstrap` or `react-bootstrap/Button` are restricted; use the shared Button wrapper instead (the wrapper folder is exempted to build it).

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
