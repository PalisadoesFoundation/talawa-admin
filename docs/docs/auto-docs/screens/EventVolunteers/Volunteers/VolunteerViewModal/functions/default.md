[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerViewModal.tsx:42](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/EventVolunteers/Volunteers/VolunteerViewModal.tsx#L42)

A modal dialog for viewing volunteer information for an event.

## Parameters

### props

[`InterfaceVolunteerViewModal`](../interfaces/InterfaceVolunteerViewModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `VolunteerViewModal` component displays all the fields of a volunteer in a modal dialog.

The modal includes:
- A header with a title and a close button.
- fields for volunteer name, status, hours volunteered, groups, and assignments.
