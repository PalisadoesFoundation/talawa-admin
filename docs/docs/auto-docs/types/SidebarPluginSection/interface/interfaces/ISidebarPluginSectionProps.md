[Admin Docs](/)

***

# Interface: ISidebarPluginSectionProps

Defined in: src/types/SidebarPluginSection/interface.ts:13

Interface for SidebarPluginSection component props.

 ISidebarPluginSectionProps

## Properties

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: src/types/SidebarPluginSection/interface.ts:15

Whether the drawer is hidden/collapsed

***

### onItemClick()?

> `optional` **onItemClick**: () => `void`

Defined in: src/types/SidebarPluginSection/interface.ts:17

Handler for plugin item clicks

#### Returns

`void`

***

### orgId?

> `optional` **orgId**: `string`

Defined in: src/types/SidebarPluginSection/interface.ts:16

Organization ID for org-specific plugins

***

### pluginItems

> **pluginItems**: [`IDrawerExtension`](../../../../plugin/types/interfaces/IDrawerExtension.md)[]

Defined in: src/types/SidebarPluginSection/interface.ts:14

Array of plugin drawer items

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: src/types/SidebarPluginSection/interface.ts:18

Use simple button style (for org drawers)
