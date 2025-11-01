[**talawa-admin**](../README.md)

***

# DeleteUser

## File

DeleteUser.tsx

## Description

This component renders a user interface for deleting a user account.
It includes a card layout with a title, a message, and a delete button styled using Bootstrap and custom CSS.
The component utilizes internationalization (i18n) for text content.

## Component

## Requires

react

## Requires

react-bootstrap/Button

## Requires

react-bootstrap/Card

## Requires

react-i18next/useTranslation

## Requires

style/app-fixed.module.css

## Example

```ts
// Example usage:
import DeleteUser from './DeleteUser';

function App() {
  return (
    <div>
      <DeleteUser />
    </div>
  );
}
```

## Remarks

- The `useTranslation` hook is used to fetch localized strings with the key prefix `settings`.
- The `styles` object is imported from a CSS module for custom styling.
- The delete button is styled with the `danger` variant from Bootstrap.

## Translation Keys

- `settings.deleteUser`: Title for the delete user section.
- `settings.deleteUserMessage`: Message displayed to the user before deletion.

## Variables

- [default](variables/default.md)
