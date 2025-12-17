[Admin Docs](/)

***

# Interface: ISidebarNavItemProps

Defined in: src/types/SidebarNavItem/interface.ts:15

Interface for SidebarNavItem component props.

 ISidebarNavItemProps

## Properties

### dataCy?

> `optional` **dataCy**: `string`

Defined in: src/types/SidebarNavItem/interface.ts:24

Cypress E2E test selector (data-cy attribute)

***

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: src/types/SidebarNavItem/interface.ts:20

Whether the drawer is hidden/collapsed

***

### icon

> **icon**: `ReactNode`

Defined in: src/types/SidebarNavItem/interface.ts:17

Icon component or element

***

### iconType?

> `optional` **iconType**: `"react-icon"` \| `"svg"`

Defined in: src/types/SidebarNavItem/interface.ts:23

Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified.

***

### label

> **label**: `string`

Defined in: src/types/SidebarNavItem/interface.ts:18

Display label for the navigation item

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: src/types/SidebarNavItem/interface.ts:21

Optional click handler

#### Returns

`void`

***

### testId

> **testId**: `string`

Defined in: src/types/SidebarNavItem/interface.ts:19

Test ID for testing purposes

***

### to

> **to**: `string`

Defined in: src/types/SidebarNavItem/interface.ts:16

Navigation target URL

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: src/types/SidebarNavItem/interface.ts:22

Use simple button style (for org drawers)
