[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/FundCampaignPledge/PledgeDeleteModal.tsx:42](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/FundCampaignPledge/PledgeDeleteModal.tsx#L42)

A modal dialog for confirming the deletion of a pledge.

## Parameters

### props

[`InterfaceDeletePledgeModal`](../interfaces/InterfaceDeletePledgeModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `PledgeDeleteModal` component displays a confirmation dialog when a user attempts to delete a pledge.
It allows the user to either confirm or cancel the deletion.
On confirmation, the `deletePledge` mutation is called to remove the pledge from the database,
and the `refetchPledge` function is invoked to update the list of pledges.
A success or error toast notification is shown based on the result of the deletion operation.

The modal includes:
- A header with a title and a close button.
- A body with a message asking for confirmation.
- A footer with "Yes" and "No" buttons to confirm or cancel the deletion.

The `deletePledge` mutation is used to perform the deletion operation.
