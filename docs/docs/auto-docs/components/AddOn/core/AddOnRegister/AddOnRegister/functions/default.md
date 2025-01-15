[**talawa-admin**](../../../../../../README.md)

***

[talawa-admin](../../../../../../modules.md) / [components/AddOn/core/AddOnRegister/AddOnRegister](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `JSX.Element`

Defined in: [src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx:38](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/components/AddOn/core/AddOnRegister/AddOnRegister.tsx#L38)

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
