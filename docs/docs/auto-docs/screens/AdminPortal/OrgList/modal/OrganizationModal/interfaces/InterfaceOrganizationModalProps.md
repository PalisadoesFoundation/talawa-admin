[Admin Docs](/)

***

# Interface: InterfaceOrganizationModalProps

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L38)

Interface for the properties of the OrganizationModal component.

## Properties

### createOrg()

> **createOrg**: (`e`) => `Promise`\<`void`\>

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L48)

A function to handle the submission of the organization creation form.

#### Parameters

##### e

`ChangeEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>

***

### formState

> **formState**: `InterfaceFormStateType`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L44)

The state of the form in the organization modal.

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L46)

A function to update the state of the form in the organization modal.

#### Parameters

##### state

`SetStateAction`\<`InterfaceFormStateType`\>

#### Returns

`void`

***

### showModal

> **showModal**: `boolean`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L40)

A boolean indicating whether the modal should be displayed.

***

### toggleModal()

> **toggleModal**: () => `void`

Defined in: [src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx#L42)

A function to toggle the visibility of the modal.

#### Returns

`void`
