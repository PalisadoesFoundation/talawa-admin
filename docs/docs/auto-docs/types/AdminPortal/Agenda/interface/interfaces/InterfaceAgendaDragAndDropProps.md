[Admin Docs](/)

***

# Interface: InterfaceAgendaDragAndDropProps

Defined in: [src/types/AdminPortal/Agenda/interface.ts:295](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L295)

Props for the AgendaDragAndDrop component.

Defines the data and callback handlers required to render
agenda folders and agenda items with drag-and-drop support,
along with edit, preview, and delete actions.

## Properties

### agendaFolderConnection

> **agendaFolderConnection**: `"Organization"` \| `"Event"`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:298](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L298)

***

### folders

> **folders**: [`InterfaceAgendaFolderInfo`](InterfaceAgendaFolderInfo.md)[]

Defined in: [src/types/AdminPortal/Agenda/interface.ts:296](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L296)

***

### onDeleteFolder()

> **onDeleteFolder**: (`folder`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:301](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L301)

#### Parameters

##### folder

[`InterfaceAgendaFolderInfo`](InterfaceAgendaFolderInfo.md)

#### Returns

`void`

***

### onDeleteItem()

> **onDeleteItem**: (`item`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:305](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L305)

#### Parameters

##### item

[`InterfaceAgendaItemInfo`](InterfaceAgendaItemInfo.md)

#### Returns

`void`

***

### onEditFolder()

> **onEditFolder**: (`folder`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:300](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L300)

#### Parameters

##### folder

[`InterfaceAgendaFolderInfo`](InterfaceAgendaFolderInfo.md)

#### Returns

`void`

***

### onEditItem()

> **onEditItem**: (`item`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:304](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L304)

#### Parameters

##### item

[`InterfaceAgendaItemInfo`](InterfaceAgendaItemInfo.md)

#### Returns

`void`

***

### onPreviewItem()

> **onPreviewItem**: (`item`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L303)

#### Parameters

##### item

[`InterfaceAgendaItemInfo`](InterfaceAgendaItemInfo.md)

#### Returns

`void`

***

### refetchAgendaFolder()

> **refetchAgendaFolder**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:306](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L306)

#### Returns

`void`

***

### setFolders

> **setFolders**: `Dispatch`\<`SetStateAction`\<[`InterfaceAgendaFolderInfo`](InterfaceAgendaFolderInfo.md)[]\>\>

Defined in: [src/types/AdminPortal/Agenda/interface.ts:297](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L297)
