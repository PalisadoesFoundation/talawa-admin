[**talawa-admin**](../../../../README.md)

***

# Interface: ISidebarPluginSectionProps

Defined in: [src/types/SidebarPluginSection/interface.ts:6](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SidebarPluginSection/interface.ts#L6)

Interface for SidebarPluginSection component props.

## Properties

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarPluginSection/interface.ts:10](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SidebarPluginSection/interface.ts#L10)

Whether the drawer is hidden/collapsed

***

### onItemClick()?

> `optional` **onItemClick**: () => `void`

Defined in: [src/types/SidebarPluginSection/interface.ts:14](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SidebarPluginSection/interface.ts#L14)

(Optional) Handler for plugin item clicks

#### Returns

`void`

***

### orgId?

> `optional` **orgId**: `string`

Defined in: [src/types/SidebarPluginSection/interface.ts:12](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SidebarPluginSection/interface.ts#L12)

(Optional) Organization ID for org-specific plugins

***

### pluginItems

> **pluginItems**: [`IDrawerExtension`](../../../../plugin/types/interfaces/IDrawerExtension.md)[]

Defined in: [src/types/SidebarPluginSection/interface.ts:8](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SidebarPluginSection/interface.ts#L8)

Array of plugin drawer items

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: [src/types/SidebarPluginSection/interface.ts:16](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SidebarPluginSection/interface.ts#L16)

(Optional) Use simple button style (for org drawers)
