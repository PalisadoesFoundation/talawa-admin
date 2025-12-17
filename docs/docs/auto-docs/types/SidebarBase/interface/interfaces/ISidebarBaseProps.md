[Admin Docs](/)

***

# Interface: ISidebarBaseProps

Defined in: src/types/SidebarBase/interface.ts:14

Interface for SidebarBase component props.

 ISidebarBaseProps

## Properties

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: src/types/SidebarBase/interface.ts:21

Optional background color override

***

### children

> **children**: `ReactNode`

Defined in: src/types/SidebarBase/interface.ts:18

Navigation items and other content

***

### footerContent?

> `optional` **footerContent**: `ReactNode`

Defined in: src/types/SidebarBase/interface.ts:20

Optional footer content

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: src/types/SidebarBase/interface.ts:19

Optional content after branding (e.g., org section)

***

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: src/types/SidebarBase/interface.ts:15

State indicating whether the sidebar is hidden

***

### persistToggleState?

> `optional` **persistToggleState**: `boolean`

Defined in: src/types/SidebarBase/interface.ts:22

Whether to persist toggle state to localStorage

***

### portalType

> **portalType**: `"user"` \| `"admin"`

Defined in: src/types/SidebarBase/interface.ts:17

Type of portal (admin or user)

***

### setHideDrawer

> **setHideDrawer**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: src/types/SidebarBase/interface.ts:16

Function to toggle sidebar visibility
