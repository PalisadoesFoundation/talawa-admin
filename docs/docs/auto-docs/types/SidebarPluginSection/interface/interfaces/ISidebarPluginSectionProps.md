[Admin Docs](/)

***

# Interface: ISidebarPluginSectionProps

Defined in: [src/types/SidebarPluginSection/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarPluginSection/interface.ts#L12)

Interface for SidebarPluginSection component props.

## Param

Array of plugin drawer items

## Param

Whether the drawer is hidden/collapsed

## Param

(Optional) Organization ID for org-specific plugins

## Param

(Optional) Handler for plugin item clicks

## Param

(Optional) Use simple button style (for org drawers)

## Properties

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarPluginSection/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarPluginSection/interface.ts#L14)

***

### onItemClick()?

> `optional` **onItemClick**: () => `void`

Defined in: [src/types/SidebarPluginSection/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarPluginSection/interface.ts#L16)

#### Returns

`void`

***

### orgId?

> `optional` **orgId**: `string`

Defined in: [src/types/SidebarPluginSection/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarPluginSection/interface.ts#L15)

***

### pluginItems

> **pluginItems**: [`IDrawerExtension`](../../../../plugin/types/interfaces/IDrawerExtension.md)[]

Defined in: [src/types/SidebarPluginSection/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarPluginSection/interface.ts#L13)

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: [src/types/SidebarPluginSection/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SidebarPluginSection/interface.ts#L17)
