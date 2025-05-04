[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceVolunteerGroupModal`](../interfaces/InterfaceVolunteerGroupModal.md)\>

Defined in: [src/screens/EventVolunteers/VolunteerGroups/modal/VolunteerGroupModal.tsx:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/VolunteerGroups/modal/VolunteerGroupModal.tsx#L102)

A modal dialog for creating or editing a volunteer group.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The ID of the event associated with volunteer group.

## Param

The ID of the organization associated with volunteer group.

## Param

The volunteer group object to be edited.

## Param

Function to refetch the volunteer groups after creation or update.

## Param

The mode of the modal (create or edit).

## Returns

The rendered modal component.

The `VolunteerGroupModal` component displays a form within a modal dialog for creating or editing a Volunteer Group.
It includes fields for entering the group name, description, volunteersRequired, and selecting volunteers/leaders.

The modal includes:
- A header with a title indicating the current mode (create or edit) and a close button.
- A form with:
  - An input field for entering the group name.
  - A textarea for entering the group description.
  - A multi-select dropdown for selecting leader.
  - A multi-select dropdown for selecting volunteers.
  - An input field for entering the number of volunteers required.
- A submit button to create or update the pledge.

On form submission, the component either:
- Calls `updatePledge` mutation to update an existing pledge, or
- Calls `createPledge` mutation to create a new pledge.

Success or error messages are displayed using toast notifications based on the result of the mutation.
