[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceDeletePledgeModal`](../interfaces/InterfaceDeletePledgeModal.md)\>

Defined in: [src/screens/FundCampaignPledge/PledgeDeleteModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/FundCampaignPledge/PledgeDeleteModal.tsx#L42)

A modal dialog for confirming the deletion of a pledge.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The pledge object to be deleted.

## Param

Function to refetch the pledges after deletion.

## Returns

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
