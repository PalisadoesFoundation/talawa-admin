[**talawa-admin**](../README.md)

***

# UserUpdate

**`Interface`** **`Function`**

UserUpdate Component

This component provides a user interface for updating a user's password.
It includes form fields for entering the previous password, a new password,
and confirming the new password. The component validates the input and
communicates with the backend to update the password using a GraphQL mutation.

## File

UserPasswordUpdate.tsx

## Requires

React

## Requires

@apollo/client - For executing the GraphQL mutation.

## Requires

GraphQl/Mutations/mutations - Contains the `UPDATE_USER_PASSWORD_MUTATION`.

## Requires

react-i18next - For internationalization and translations.

## Requires

react-bootstrap/Button - For styled buttons.

## Requires

react-bootstrap/Form - For form controls.

## Requires

style/app.module.css - For component-specific styles.

## Requires

react-toastify - For displaying success and error notifications.

 InterfaceUserPasswordUpdateProps

## Remarks

- Validates that all fields are filled and that the new password matches the confirmation.
- Displays success or error messages using `react-toastify`.
- Reloads the page after a successful update or when the user cancels the operation.

## Example

```tsx
<UserUpdate id="12345" />
```

## Variables

- [UserUpdate](variables/UserUpdate.md)

## References

### default

Renames and re-exports [UserUpdate](variables/UserUpdate.md)
