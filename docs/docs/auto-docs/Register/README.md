[**talawa-admin**](../README.md)

***

# Register

## File

Register.tsx

## Description

This component provides a user registration form with fields for first name, last name, email,
password, and confirm password. It includes validation, error handling, and integration with a GraphQL mutation
for user registration. The component also allows switching to the login mode.

## Param

Props containing a function to change the current mode.

## Remarks

- Uses `react-bootstrap` for UI components and `@mui/icons-material` for icons.
- Integrates with `react-toastify` for notifications and `@apollo/client` for GraphQL mutation.
- Includes i18n support using `react-i18next`.

## Example

```tsx
<Register setCurrentMode={setModeFunction} />
```

## Functions

- [default](functions/default.md)
