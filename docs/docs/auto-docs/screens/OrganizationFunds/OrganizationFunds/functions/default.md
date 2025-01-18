[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/OrganizationFunds/OrganizationFunds.tsx:79](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/OrganizationFunds/OrganizationFunds.tsx#L79)

`organizationFunds` component displays a list of funds for a specific organization,
allowing users to search, sort, view and edit funds.

This component utilizes the `DataGrid` from Material-UI to present the list of funds in a tabular format,
and includes functionality for filtering and sorting. It also handles the opening and closing of modals
for creating and editing.

It includes:
- A search input field to filter funds by name.
- A dropdown menu to sort funds by creation date.
- A button to create a new fund.
- A table to display the list of funds with columns for fund details and actions.
- Modals for creating and editing funds.

### GraphQL Queries
- `FUND_LIST`: Fetches a list of funds for the given organization, filtered and sorted based on the provided parameters.

### Props
- `orgId`: The ID of the organization whose funds are being managed.

### State
- `fund`: The currently selected fund for editing or deletion.
- `searchTerm`: The current search term used for filtering funds.
- `sortBy`: The current sorting order for funds.
- `modalState`: The state of the modals (edit/create).
- `fundModalMode`: The mode of the fund modal (edit or create).

### Methods
- `handleOpenModal(fund: InterfaceFundInfo | null, mode: 'edit' | 'create')`: Opens the fund modal with the given fund and mode.
- `handleClick(fundId: string)`: Navigates to the campaign page for the specified fund.

## Returns

`Element`

The rendered component.
