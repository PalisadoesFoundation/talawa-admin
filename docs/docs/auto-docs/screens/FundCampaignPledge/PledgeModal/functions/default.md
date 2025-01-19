[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/FundCampaignPledge/PledgeModal.tsx:89](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/FundCampaignPledge/PledgeModal.tsx#L89)

A modal dialog for creating or editing a pledge.

## Parameters

### props

[`InterfacePledgeModal`](../interfaces/InterfacePledgeModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `PledgeModal` component displays a form within a modal dialog for creating or editing a pledge.
It includes fields for selecting users, entering an amount, choosing a currency, and setting start and end dates for the pledge.

The modal includes:
- A header with a title indicating the current mode (create or edit) and a close button.
- A form with:
  - A multi-select dropdown for selecting users to participate in the pledge.
  - Date pickers for selecting the start and end dates of the pledge.
  - A dropdown for selecting the currency of the pledge amount.
  - An input field for entering the pledge amount.
- A submit button to create or update the pledge.

On form submission, the component either:
- Calls `updatePledge` mutation to update an existing pledge, or
- Calls `createPledge` mutation to create a new pledge.

Success or error messages are displayed using toast notifications based on the result of the mutation.

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
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.
