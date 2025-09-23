[Admin Docs](/)

***

# Interface: IItemModalProps

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L80)

Props for the `ItemModal` component.

## Properties

### actionItem

> **actionItem**: [`IActionItemInfo`](types\Actions\interface\README\interfaces\IActionItemInfo.md)

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L92)

Existing action item data (null for create mode)

***

### actionItemsRefetch()

> **actionItemsRefetch**: () => `void`

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L90)

Function to refetch action items data after mutation

#### Returns

`void`

***

### editMode

> **editMode**: `boolean`

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L94)

Whether the modal is in edit mode (true) or create mode (false)

***

### eventId

> **eventId**: `string`

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L88)

Optional event ID if the action item is associated with an event

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L84)

Function to hide/close the modal

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L82)

Whether the modal is currently open/visible

***

### orgId

> **orgId**: `string`

Defined in: [src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ActionItemModal/ActionItemModal.tsx#L86)

Organization ID for which the action item belongs
