[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupViewModal.tsx:41](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/EventVolunteers/VolunteerGroups/VolunteerGroupViewModal.tsx#L41)

A modal dialog for viewing volunteer group information for an event.

## Parameters

### props

[`InterfaceVolunteerGroupViewModal`](../interfaces/InterfaceVolunteerGroupViewModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `VolunteerGroupViewModal` component displays all the fields of a volunteer group in a modal dialog.

The modal includes:
- A header with a title and a close button.
- fields for volunteer name, status, hours volunteered, groups, and assignments.
