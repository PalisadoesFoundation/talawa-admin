[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../modules.md) / [screens/FundCampaignPledge/PledgeModal](../README.md) / default

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/FundCampaignPledge/PledgeModal.tsx:72](https://github.com/bint-Eve/talawa-admin/blob/e05e1a03180dbbfc7ba850102958ea6b6cd4b01e/src/screens/FundCampaignPledge/PledgeModal.tsx#L72)

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
