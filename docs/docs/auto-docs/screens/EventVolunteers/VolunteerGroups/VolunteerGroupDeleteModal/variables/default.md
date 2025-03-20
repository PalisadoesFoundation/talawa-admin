[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceDeleteVolunteerGroupModal`](../interfaces/InterfaceDeleteVolunteerGroupModal.md)\>

Defined in: [src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupDeleteModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupDeleteModal.tsx#L42)

A modal dialog for confirming the deletion of a volunteer group.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The volunteer group to be deleted.

## Param

Function to refetch the volunteer groups after deletion.

## Returns

The rendered modal component.

The `VolunteerGroupDeleteModal` component displays a confirmation dialog when a user attempts to delete a volunteer group.
It allows the user to either confirm or cancel the deletion.
On confirmation, the `deleteVolunteerGroup` mutation is called to remove the volunteer group from the database,
and the `refetchGroups` function is invoked to update the list of volunteer groups.
A success or error toast notification is shown based on the result of the deletion operation.

The modal includes:
- A header with a title and a close button.
- A body with a message asking for confirmation.
- A footer with "Yes" and "No" buttons to confirm or cancel the deletion.

The `deleteVolunteerGroup` mutation is used to perform the deletion operation.
