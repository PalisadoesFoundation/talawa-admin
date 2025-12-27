[**talawa-admin**](README.md)

***

# PledgeModal

## File

PledgeModal.tsx

## Description

A React component for creating or editing a pledge within a modal dialog.

## Remarks

This component provides a form for managing pledges, allowing users to:
- Select participants (pledgers) for the pledge.
- Specify the pledge amount and currency.
- Set start and end dates for the pledge.

The modal supports two modes:
- `create`: For creating a new pledge.
- `edit`: For editing an existing pledge.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The ID of the campaign associated with the pledge.

## Param

The ID of the organization associated with the pledge.

## Param

The pledge object to edit, or `null` for a new pledge.

## Param

Function to refetch the list of pledges after creation or update.

## Param

The campaign's end date to validate pledge dates.

## Param

The mode of the modal, either 'create' or 'edit'.

## Example

```ts
<PledgeModal
  isOpen={true}
  hide={() => {}}
  campaignId="123"
  orgId="456"
  pledge={null}
  refetchPledge={() => {}}
  endDate={new Date()}
  mode="create"
/>
```

## Dependencies

- React
- Apollo Client for GraphQL queries and mutations.
- Material-UI and Bootstrap for UI components.
- Day.js for date manipulation.
- React-Toastify for notifications.

## Css

- Uses global styles from `app-fixed.module.css`.
- Reusable class `.addButton` for consistent button styling.

## Interfaces

- [InterfacePledgeModal](PledgeModal\README\interfaces\InterfacePledgeModal.md)

## Variables

- [default](PledgeModal\README\variables\default.md)
