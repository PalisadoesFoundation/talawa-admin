[**talawa-admin**](../../../../../README.md)

***

# Variable: LoginForm

> `const` **LoginForm**: `React.FC`\<[`InterfaceLoginFormProps`](../../../../../types/Auth/LoginForm/interface/interfaces/InterfaceLoginFormProps.md)\>

Defined in: [src/components/Auth/LoginForm/LoginForm.tsx:40](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/components/Auth/LoginForm/LoginForm.tsx#L40)

Reusable login form component that composes EmailField and PasswordField.

## Remarks

This component handles the login form UI and submission logic, delegating
authentication to the SIGNIN_QUERY GraphQL query. It supports both admin
and user login modes via the isAdmin prop.

## Param

Whether the login form is rendered for an admin user

## Param

Callback invoked with the full sign-in result (user + tokens)

## Param

Callback invoked when the login request fails

## Param

Optional test ID used for querying the component in tests

## Returns

A JSX element rendering the login form

## Example

```tsx
<LoginForm
  isAdmin={false}
  onSuccess={(token) => console.log('Logged in:', token)}
  onError={(error) => console.error('Login failed:', error)}
/>
```
