[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerDeleteModal.tsx:42](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/EventVolunteers/Volunteers/VolunteerDeleteModal.tsx#L42)

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
