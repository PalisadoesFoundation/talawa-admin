[Admin Docs](/)

***

# Function: default()

> **default**(`__namedParameters`): `JSX.Element`

Defined in: [src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx:38](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx#L38)

A React component for registering a new add-on plugin.

This component:
- Displays a button to open a modal for plugin registration.
- Contains a form in the modal for entering plugin details.
- Uses GraphQL mutation to register the plugin.
- Uses `react-i18next` for localization and `react-toastify` for notifications.
- Redirects to the organization list page if no `orgId` is found in the URL.

## Parameters

### \_\_namedParameters

`InterfaceAddOnRegisterProps`

## Returns

`JSX.Element`

A JSX element containing the button and modal for plugin registration.
