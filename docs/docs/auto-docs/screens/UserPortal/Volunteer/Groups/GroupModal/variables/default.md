[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceGroupModal`](../interfaces/InterfaceGroupModal.md)\>

Defined in: [src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx#L71)

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

## Returns

The rendered modal component.

The `VolunteerGroupModal` component displays a form within a modal dialog for creating or editing a Volunteer Group.
It includes fields for entering the group name, description, volunteersRequired, and selecting volunteers/leaders.

The modal includes:
- A header with a title indicating the current mode (create or edit) and a close button.
- A form with:
  - An input field for entering the group name.
  - A textarea for entering the group description.
  - An input field for entering the number of volunteers required.
- A submit button to create or update the pledge.

On form submission, the component either:
- Calls `updateVoluneerGroup` mutation to update an existing group, or

Success or error messages are displayed using toast notifications based on the result of the mutation.
