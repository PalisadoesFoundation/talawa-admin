[**talawa-admin**](README.md)

***

# Class: LifecycleManager

Defined in: [src/plugin/managers/lifecycle.ts:13](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L13)

## Constructors

### new LifecycleManager()

> **new LifecycleManager**(`discoveryManager`, `extensionRegistry`, `eventManager`): `LifecycleManager`

Defined in: [src/plugin/managers/lifecycle.ts:16](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L16)

#### Parameters

##### discoveryManager

[`DiscoveryManager`](plugin\managers\discovery\README\classes\DiscoveryManager.md)

##### extensionRegistry

[`ExtensionRegistryManager`](plugin\managers\extension-registry\README\classes\ExtensionRegistryManager.md)

##### eventManager

[`EventManager`](plugin\managers\event-manager\README\classes\EventManager.md)

#### Returns

`LifecycleManager`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:142](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L142)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:178](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L178)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/managers/lifecycle.ts:53](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L53)

#### Returns

`number`

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)

Defined in: [src/plugin/managers/lifecycle.ts:26](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L26)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)[]

Defined in: [src/plugin/managers/lifecycle.ts:22](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L22)

#### Returns

[`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{\}\>

Defined in: [src/plugin/managers/lifecycle.ts:33](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L33)

#### Parameters

##### pluginId

`string`

##### componentName

`string`

#### Returns

`ComponentType`\<\{\}\>

***

### getPluginCount()

> **getPluginCount**(): `number`

Defined in: [src/plugin/managers/lifecycle.ts:49](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L49)

#### Returns

`number`

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:214](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L214)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:59](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L59)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:131](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L131)

#### Parameters

##### pluginId

`string`

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`boolean`\>

***

### uninstallPlugin()

> **uninstallPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:268](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L268)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:103](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/managers/lifecycle.ts#L103)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
