[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupDeleteModal.tsx:42](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupDeleteModal.tsx#L42)

A modal dialog for confirming the deletion of a volunteer group.

## Parameters

### props

[`InterfaceDeleteVolunteerGroupModal`](../interfaces/InterfaceDeleteVolunteerGroupModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

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
