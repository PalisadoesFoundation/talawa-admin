[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

<<<<<<< HEAD
Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx:48](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx#L48)
=======
Defined in: [src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/Volunteers/VolunteerCreateModal.tsx#L48)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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
