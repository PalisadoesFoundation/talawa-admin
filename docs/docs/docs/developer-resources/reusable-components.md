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
   components/AdminPortal/**
   types/AdminPortal/**
   ```
1. User UI
   ```
   components/UserPortal/**
   types/UserPortal/**
   ```
1. Shared UI
   ```
   shared-components/**
   types/shared-components/**
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
import { ProfileAvatarDisplay } from 'components/shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

// admin
import { UserTableRow } from 'components/AdminPortal/UserTableRow/UserTableRow';
```

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
