[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceVolunteerGroupViewModal`](../interfaces/InterfaceVolunteerGroupViewModal.md)\>

Defined in: [src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupViewModal.tsx:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupViewModal.tsx#L41)

A modal dialog for viewing volunteer group information for an event.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The volunteer group to display in the modal.

## Returns

The rendered modal component.

The `VolunteerGroupViewModal` component displays all the fields of a volunteer group in a modal dialog.

The modal includes:
- A header with a title and a close button.
- fields for volunteer name, status, hours volunteered, groups, and assignments.
