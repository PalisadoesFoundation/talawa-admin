[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

<<<<<<< HEAD
Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerDeleteModal.tsx:42](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/EventVolunteers/Volunteers/VolunteerDeleteModal.tsx#L42)
=======
Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerDeleteModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/Volunteers/VolunteerDeleteModal.tsx#L42)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

A modal dialog for confirming the deletion of a volunteer.

## Parameters

### props

[`InterfaceDeleteVolunteerModal`](../interfaces/InterfaceDeleteVolunteerModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `VolunteerDeleteModal` component displays a confirmation dialog when a user attempts to delete a volunteer.
It allows the user to either confirm or cancel the deletion.
On confirmation, the `deleteVolunteer` mutation is called to remove the pledge from the database,
and the `refetchVolunteers` function is invoked to update the list of volunteers.
A success or error toast notification is shown based on the result of the deletion operation.

The modal includes:
- A header with a title and a close button.
- A body with a message asking for confirmation.
- A footer with "Yes" and "No" buttons to confirm or cancel the deletion.

The `deleteVolunteer` mutation is used to perform the deletion operation.
