---
id: reusable-components
title: Reusable Components
slug: /developer-resources/reusable-components
sidebar_position: 35
---

Shared components are UI and functional elements used across multiple sections of the application.
This guide outlines how to create and manage these components to ensure a unified design system and efficient code reuse.

## Before You Begin

It's important to understand structure and behavior of shared components before creating or refactoring them.

### Shared Component Directory Structure and Paths

Use the following path structure for shared components.

```
src/
│
├── sharedComponents/
│   ├── Component/
│   │   ├── Component.tsx
│   │   ├── Component.spec.tsx
│   │   └── ComponentMocks.ts
│   │
└── types/
    └── Component/
       ├── interface.ts
       └── type.ts
```

#### Naming Conventions

- Use **PascalCase** for component and folder names (e.g., `OrgCard`, `Button`).
- The component files name should match the component (e.g., `OrgCard.tsx`, `Button.tsx`).
- Tests should be named `Component.spec.tsx`.
- Mock files should follow `ComponentMock.ts`.
- Type interface should be defined in corresponding interface / type file.

```
src/
│
├── types/
    ├── Component
        └── interface.ts
        └── type.ts
```

### Understanding Components Reuse

Learn how shared components are integrated and reused across different areas of the application.

#### Props Driven Design

Props-driven design focuses on building components that adapt their behavior, appearance, and content based on the props rather than hardcoded values. This approach increases flexibility and reusability, allowing the same component to serve multiple purposes across the application. By passing data, event handlers, and configuration options through props.

```tsx
import React from 'react';
import styles from 'style/app-fixed.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  const variantStyle =
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton;

  return (
    <button onClick={onClick} className={`${styles.buttonStyle} ${variantStyle}`}>
      {label}
    </button>
  );
};

export default Button;
```

#### Handling Role Based Differences

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

      <button
        onClick={handleClick}
        className={styles.orgCardButton}
      >
        {role === 'admin' ? 'Manage' : isMember ? 'Visit' : 'Join'}
      </button>
    </div>
  );
};

export default OrgCard;
```

## Creating Shared Component

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

#### Example

- **Role based props**

  When a component behaves differently for user types (admin / user), define a `role` prop to handle that difference cleanly.

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

- **Variant based props**

  For components with multiple design or behavior styles (like buttons or cards), define a `variant` prop.

  ```typescript
  interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outlined';
  }
  ```

  The `variant` prop helps the component adapt its appearance dynamically:

  1. `primary` → For main action on a page (example: Save, Submit).
  2. `secondary` → For supporting action (example: Cancel, Edit).
  3. `outlined` → For neutral or optional actions (example: Learn more, Back).

### Styling Guidelines

- Use existing global or shared CSS modules whenever possible to maintain consistency.
- Avoid inline styles unles necessary for dynamic cases.
- When defining styles, prefer semantic class names (e.g., `buttonPrimary`, `cardHeader`).

### Testing Shared Component

- Each shared component must include a corresponding test file (`Component.spec.tsx`)
- Refer to the [testing page of the documentation website](https://docs-admin.talawa.io/docs/developer-resources/testing)

### Document Your Code

Use TSDoc comments to document functions, classes, and interfaces within reusable components. Clearly describe the component's purpose, its props and any return value. This practice not only improves readability but also helps maintain consistency across shared components, especially when they are used by multiple developers or teams. Well-documented props and behavior makes it easier for others to quickly understand how to use, extend, or debug the component without needing to inspect its internal implementation.

``` ts
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