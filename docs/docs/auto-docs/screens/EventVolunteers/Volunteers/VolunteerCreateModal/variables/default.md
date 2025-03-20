[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceVolunteerCreateModal`](../interfaces/InterfaceVolunteerCreateModal.md)\>

Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx#L48)

A modal dialog for add a volunteer for an event.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The ID of the event associated with volunteer.

## Param

The ID of the organization associated with volunteer.

## Param

Function to refetch the volunteers after adding a volunteer.

## Returns

The rendered modal component.

The `VolunteerCreateModal` component displays a form within a modal dialog for adding a volunteer.
It includes fields for selecting user.

The modal includes:
- A header with a title and a close button.
- A form with:
- A multi-select dropdown for selecting user be added as volunteer.
- A submit button to create or update the pledge.

On form submission, the component:
- Calls `addVolunteer` mutation to add a new Volunteer.

Success or error messages are displayed using toast notifications based on the result of the mutation.
