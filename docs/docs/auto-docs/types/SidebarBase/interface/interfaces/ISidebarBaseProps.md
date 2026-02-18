[Admin Docs](/)

***

# Interface: ISidebarBaseProps

Defined in: [src/types/SidebarBase/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L4)

Interface for SidebarBase component props.

## Properties

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/types/SidebarBase/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L18)

(Optional) Background color override

***

### children

> **children**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L12)

Navigation items and other content

***

### footerContent?

> `optional` **footerContent**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L16)

(Optional) Footer content

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L14)

(Optional) Content after branding (e.g., org section)

***

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarBase/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L6)

State indicating whether the sidebar is hidden

***

### persistToggleState?

> `optional` **persistToggleState**: `boolean`

Defined in: [src/types/SidebarBase/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L20)

(Optional) Whether to persist toggle state to localStorage

***

### portalType

> **portalType**: `"user"` \| `"admin"`

Defined in: [src/types/SidebarBase/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L10)

Type of portal (admin or user)

***

### setHideDrawer

> **setHideDrawer**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/SidebarBase/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L8)

Function to toggle sidebar visibility
