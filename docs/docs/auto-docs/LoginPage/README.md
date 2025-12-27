[**talawa-admin**](README.md)

***

# LoginPage

## File

LoginPage.tsx

## Description

This file contains the implementation of the Login and Registration page for the Talawa Admin application.
It includes functionality for user authentication, password validation, reCAPTCHA verification, and organization selection.
The page supports both admin and user roles and provides localization support.

## Requires

react

## Requires

react-router-dom

## Requires

react-bootstrap

## Requires

react-google-recaptcha

## Requires

@apollo/client

## Requires

@mui/icons-material

## Requires

@mui/material

## Requires

react-toastify

## Requires

i18next

## Requires

utils/errorHandler

## Requires

utils/useLocalstorage

## Requires

utils/useSession

## Requires

utils/i18n

## Requires

GraphQl/Mutations/mutations

## Requires

GraphQl/Queries/Queries

## Requires

components/ChangeLanguageDropdown/ChangeLanguageDropDown

## Requires

components/LoginPortalToggle/LoginPortalToggle

## Requires

assets/svgs/palisadoes.svg

## Requires

assets/svgs/talawa.svg

## Component

## Description

The `loginPage` component renders a login and registration interface with the following features:
- Login and registration forms with validation.
- Password strength checks and visibility toggles.
- reCAPTCHA integration for bot prevention.
- Organization selection using an autocomplete dropdown.
- Social media links and community branding.
- Role-based navigation for admin and user.

## Example

```tsx
import LoginPage from './LoginPage';

const App = () => {
  return <LoginPage />;
};

export default App;
```

## Functions

- [default](LoginPage\README\functions\default.md)
