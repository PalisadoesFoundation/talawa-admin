[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceFundModal`](../interfaces/InterfaceFundModal.md)\>

Defined in: [src/screens/OrganizationFunds/modal/FundModal.tsx:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFunds/modal/FundModal.tsx#L69)

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

## Returns

The rendered modal dialog.

## CSS Strategy Explanation:

To ensure consistency across the application and reduce duplication, common styles
(such as button styles) have been moved to the global CSS file. Instead of using
component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
class (e.g., .addButton) is now applied.

### Benefits:
- **Reduces redundant CSS code.
- **Improves maintainability by centralizing common styles.
- **Ensures consistent styling across components.

### Global CSS Classes used:
- `.switch`

For more details on the reusable classes, refer to the global CSS file.
