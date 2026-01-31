[Admin Docs](/)

***

# Interface: ISidebarBaseProps

Defined in: [src/types/SidebarBase/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L14)

Interface for SidebarBase component props.

 ISidebarBaseProps

## Properties

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/types/SidebarBase/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L21)

Optional background color override

***

### children

> **children**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L18)

Navigation items and other content

***

### footerContent?

> `optional` **footerContent**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L20)

Optional footer content

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L19)

Optional content after branding (e.g., org section)

***

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarBase/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L15)

State indicating whether the sidebar is hidden

***

### persistToggleState?

> `optional` **persistToggleState**: `boolean`

Defined in: [src/types/SidebarBase/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L22)

Whether to persist toggle state to localStorage

***

### portalType

> **portalType**: `"user"` \| `"admin"`

Defined in: [src/types/SidebarBase/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L17)

Type of portal (admin or user)

***

### setHideDrawer

> **setHideDrawer**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/SidebarBase/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L16)

Function to toggle sidebar visibility
