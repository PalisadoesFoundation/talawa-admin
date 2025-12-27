[**talawa-admin**](README.md)

***

# Interface: ISidebarPluginSectionProps

Defined in: [src/types/SidebarPluginSection/interface.ts:13](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/SidebarPluginSection/interface.ts#L13)

Interface for SidebarPluginSection component props.

 ISidebarPluginSectionProps

## Properties

### hideDrawer

> **hideDrawer**: `boolean`

Defined in: [src/types/SidebarPluginSection/interface.ts:15](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/SidebarPluginSection/interface.ts#L15)

Whether the drawer is hidden/collapsed

***

### onItemClick()?

> `optional` **onItemClick**: () => `void`

Defined in: [src/types/SidebarPluginSection/interface.ts:17](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/SidebarPluginSection/interface.ts#L17)

Handler for plugin item clicks

#### Returns

`void`

***

### orgId?

> `optional` **orgId**: `string`

Defined in: [src/types/SidebarPluginSection/interface.ts:16](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/SidebarPluginSection/interface.ts#L16)

Organization ID for org-specific plugins

***

### pluginItems

> **pluginItems**: [`IDrawerExtension`](plugin\types\README\interfaces\IDrawerExtension.md)[]

Defined in: [src/types/SidebarPluginSection/interface.ts:14](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/SidebarPluginSection/interface.ts#L14)

Array of plugin drawer items

***

### useSimpleButton?

> `optional` **useSimpleButton**: `boolean`

Defined in: [src/types/SidebarPluginSection/interface.ts:18](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/SidebarPluginSection/interface.ts#L18)

Use simple button style (for org drawers)
