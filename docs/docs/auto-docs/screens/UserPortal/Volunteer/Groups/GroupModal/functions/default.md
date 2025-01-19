[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx:71](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/UserPortal/Volunteer/Groups/GroupModal.tsx#L71)

A modal dialog for creating or editing a volunteer group.

## Parameters

### props

[`InterfaceGroupModal`](../interfaces/InterfaceGroupModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

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
