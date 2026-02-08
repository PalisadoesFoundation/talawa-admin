[Admin Docs](/)

***

# Interface: ISidebarBaseProps

Defined in: [src/types/SidebarBase/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L13)

Interface for SidebarBase component props.

## Param

State indicating whether the sidebar is hidden

## Param

Function to toggle sidebar visibility

## Param

Type of portal (admin or user)

## Param

Navigation items and other content

## Param

(Optional) Content after branding (e.g., org section)

## Param

(Optional) Footer content

## Param

(Optional) Background color override

## Param

(Optional) Whether to persist toggle state to localStorage

## Properties

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/types/SidebarBase/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L20)

***

### children

> **children**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L17)

***

### footerContent?

> `optional` **footerContent**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L19)

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/SidebarBase/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L18)

***

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarBase/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L14)

***

### persistToggleState?

> `optional` **persistToggleState**: `boolean`

Defined in: [src/types/SidebarBase/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L21)

***

### portalType

> **portalType**: `"user"` \| `"admin"`

Defined in: [src/types/SidebarBase/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L16)

***

### setHideDrawer

> **setHideDrawer**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/SidebarBase/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarBase/interface.ts#L15)
