[Admin Docs](/)

***

# Interface: InterfaceOrganizationModalProps

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L37)

Interface for the properties of the OrganizationModal component.

## Properties

### createOrg()

> **createOrg**: (`e`) => `Promise`\<`void`\>

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L47)

A function to handle the submission of the organization creation form.

#### Parameters

##### e

`FormEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>

***

### formState

> **formState**: `InterfaceFormStateType`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L43)

The state of the form in the organization modal.

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L45)

A function to update the state of the form in the organization modal.

#### Parameters

##### state

`SetStateAction`\<`InterfaceFormStateType`\>

#### Returns

`void`

***

### showModal

> **showModal**: `boolean`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L39)

A boolean indicating whether the modal should be displayed.

***

### toggleModal()

> **toggleModal**: () => `void`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L41)

A function to toggle the visibility of the modal.

#### Returns

`void`
