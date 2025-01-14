[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [screens/OrganizationFunds/FundModal](../README.md) / default

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/OrganizationFunds/FundModal.tsx:52](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/screens/OrganizationFunds/FundModal.tsx#L52)

`FundModal` component provides a modal dialog for creating or editing a fund.
It allows users to input fund details and submit them to the server.

This component handles both the creation of new funds and the editing of existing funds,
based on the `mode` prop. It displays a form with fields for the fund's name, description,
and other relevant details. Upon submission, it interacts with the GraphQL API to save
or update the fund details and triggers a refetch of the fund data.

### Props
- `isOpen`: A boolean indicating whether the modal is open or closed.
- `hide`: A function to close the modal.
- `refetchFunds`: A function to refetch the fund list after a successful operation.
- `fund`: The current fund object being edited or `null` if creating a new fund.
- `orgId`: The ID of the organization to which the fund belongs.
- `mode`: The mode of the modal, either 'edit' or 'create'.

### State
- `name`: The name of the fund.
- `description`: The description of the fund.
- `amount`: The amount associated with the fund.
- `status`: The status of the fund (e.g., active, archived).

### Methods
- `handleSubmit()`: Handles form submission, creates or updates the fund, and triggers a refetch of the fund list.
- `handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)`: Updates the state based on user input.

## Parameters

### props

[`InterfaceFundModal`](../interfaces/InterfaceFundModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal dialog.
