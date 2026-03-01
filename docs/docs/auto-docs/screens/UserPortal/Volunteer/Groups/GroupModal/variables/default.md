[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceGroupModal`](../interfaces/InterfaceGroupModal.md)\>

Defined in: [src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx#L70)

A modal dialog for editing a volunteer group.

## Param

Indicates whether the modal is open.

## Param

Function to close the modal.

## Param

The ID of the event associated with the volunteer group.

## Param

The volunteer group object to be edited.

## Param

Function to refetch the volunteer groups after an update.

## Returns

The rendered modal component.

The `GroupModal` component displays a form within a modal dialog for editing a Volunteer Group.
It includes fields for entering the group name, description, and volunteersRequired.

The modal includes:
- A toggle to switch between "details" and "requests" views.
- A form with:
  - An input field for entering the group name.
  - A textarea for entering the group description.
  - An input field for entering the number of volunteers required.
  - A submit button to update the group.
- A requests view showing pending membership requests with accept/reject actions.

On form submission, the component calls `updateVolunteerGroup` mutation to update the group.
Success or error messages are displayed using toast notifications based on the result of the mutation.
