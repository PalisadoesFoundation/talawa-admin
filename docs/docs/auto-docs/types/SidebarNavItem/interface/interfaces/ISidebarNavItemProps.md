[Admin Docs](/)

***

# Interface: ISidebarNavItemProps

Defined in: [src/types/SidebarNavItem/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L14)

Interface for SidebarNavItem component props.

 ISidebarNavItemProps

## Properties

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarNavItem/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L19)

Whether the drawer is hidden/collapsed

***

### icon

> **icon**: `ReactNode`

Defined in: [src/types/SidebarNavItem/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L16)

Icon component or element

***

### iconType?

> `optional` **iconType**: `"react-icon"` \| `"svg"`

Defined in: [src/types/SidebarNavItem/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L22)

Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified.

***

### label

> **label**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L17)

Display label for the navigation item

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [src/types/SidebarNavItem/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L20)

Optional click handler

#### Returns

`void`

***

### testId

> **testId**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L18)

Test ID for testing purposes

***

### to

> **to**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L15)

Navigation target URL

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: [src/types/SidebarNavItem/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L21)

Use simple button style (for org drawers)
