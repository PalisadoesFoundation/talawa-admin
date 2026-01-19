[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceGroupModalProps`](../../../../../../types/UserPortal/GroupModal/interface/interfaces/InterfaceGroupModalProps.md)\>

Defined in: [src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx#L60)

A modal dialog for editing a volunteer group.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The ID of the event associated with volunteer group.

## Param

The volunteer group object to be edited.

## Param

Function to refetch the volunteer groups after creation or update.

## Returns

The rendered modal component.

The `GroupModal` component displays a form within a modal dialog for updating a Volunteer Group.
It includes fields for entering the group name, description, and volunteersRequired.

The modal includes:
- A header with a title and a close button.
- A form with:
- An input field for entering the group name.
- A textarea for entering the group description.
- An input field for entering the number of volunteers required.
- A submit button to update the group.
On form submission, the component calls `updateVolunteerGroup` to update the existing group.
- Calls `updateVolunteerGroup` mutation to update an existing group, or

Success or error messages are displayed using toast notifications based on the result of the mutation.
