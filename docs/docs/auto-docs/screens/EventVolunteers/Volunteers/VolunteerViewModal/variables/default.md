[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceVolunteerViewModal`](../interfaces/InterfaceVolunteerViewModal.md)\>

Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerViewModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/Volunteers/VolunteerViewModal.tsx#L42)

A modal dialog for viewing volunteer information for an event.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The volunteer object to be displayed.

## Returns

The rendered modal component.

The `VolunteerViewModal` component displays all the fields of a volunteer in a modal dialog.

The modal includes:
- A header with a title and a close button.
- fields for volunteer name, status, hours volunteered, groups, and assignments.
