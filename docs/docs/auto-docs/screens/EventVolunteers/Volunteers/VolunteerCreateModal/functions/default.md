[**talawa-admin**](../../../../../README.md)

***

[talawa-admin](../../../../../README.md) / [screens/EventVolunteers/Volunteers/VolunteerCreateModal](../README.md) / default

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx:48](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx#L48)

A modal dialog for add a volunteer for an event.

## Parameters

### props

[`InterfaceVolunteerCreateModal`](../interfaces/InterfaceVolunteerCreateModal.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `VolunteerCreateModal` component displays a form within a modal dialog for adding a volunteer.
It includes fields for selecting user.

The modal includes:
- A header with a title and a close button.
- A form with:
- A multi-select dropdown for selecting user be added as volunteer.
- A submit button to create or update the pledge.

On form submission, the component:
- Calls `addVolunteer` mutation to add a new Volunteer.

Success or error messages are displayed using toast notifications based on the result of the mutation.
