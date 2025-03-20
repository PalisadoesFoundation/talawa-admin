[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfacePledgeModal`](../interfaces/InterfacePledgeModal.md)\>

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L54)

`PledgeModal` is a React component that allows users to create or edit a pledge for a specific campaign.
It displays a form with inputs for pledge details such as amount, currency, dates, and users involved in the pledge.

## Param

Determines if the modal is visible or hidden.

## Param

Function to close the modal.

## Param

The ID of the campaign for which the pledge is being made.

## Param

The ID of the user making or editing the pledge.

## Param

The current pledge information if in edit mode, or null if creating a new pledge.

## Param

Function to refresh the pledge data after a successful operation.

## Param

The maximum date allowed for the pledge's end date, based on the campaign's end date.

## Param

Specifies whether the modal is used for creating a new pledge or editing an existing one.
