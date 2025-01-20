[Admin Docs](/)

***

# Function: default()

> **default**(`__namedParameters`): `JSX.Element`

<<<<<<< HEAD
Defined in: [src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx:38](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx#L38)
=======
Defined in: [src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx#L38)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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
