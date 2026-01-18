[Admin Docs](/)

***

# Variable: LoginForm

> `const` **LoginForm**: `React.FC`\<[`InterfaceLoginFormProps`](../../../../../types/Auth/LoginForm/interface/interfaces/InterfaceLoginFormProps.md)\>

Defined in: [src/components/Auth/LoginForm/LoginForm.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/LoginForm/LoginForm.tsx#L30)

Reusable login form component that composes EmailField and PasswordField.

## Remarks

This component handles the login form UI and submission logic, delegating
authentication to the SIGNIN_QUERY GraphQL query. It supports both admin
and user login modes via the isAdmin prop.

## Example

```tsx
<LoginForm
  isAdmin={false}
  onSuccess={(signInData) => console.log('Logged in:', signInData)}
  onError={(error) => console.error('Login failed:', error)}
/>
```
