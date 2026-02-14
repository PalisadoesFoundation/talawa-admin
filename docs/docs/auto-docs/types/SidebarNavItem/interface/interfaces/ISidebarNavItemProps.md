[Admin Docs](/)

***

# Interface: ISidebarNavItemProps

Defined in: [src/types/SidebarNavItem/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L14)

Interface for SidebarNavItem component props.

## Param

Navigation target URL

## Param

Icon component or element

## Param

Display label for the navigation item

## Param

Test ID for testing purposes

## Param

Whether the drawer is hidden/collapsed

## Param

(Optional) Click handler

## Param

(Optional) Use simple button style (for org drawers)

## Param

(Optional) Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified.

## Param

(Optional) Cypress E2E test selector (data-cy attribute)

## Properties

### dataCy?

> `optional` **dataCy**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L23)

***

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarNavItem/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L19)

***

### icon

> **icon**: `ReactNode`

Defined in: [src/types/SidebarNavItem/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L16)

***

### iconType?

> `optional` **iconType**: `"svg"` \| `"react-icon"`

Defined in: [src/types/SidebarNavItem/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L22)

***

### label

> **label**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L17)

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [src/types/SidebarNavItem/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L20)

#### Returns

`void`

***

### testId

> **testId**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L18)

***

### to

> **to**: `string`

Defined in: [src/types/SidebarNavItem/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L15)

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: [src/types/SidebarNavItem/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarNavItem/interface.ts#L21)
