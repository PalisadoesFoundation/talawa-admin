[Admin Docs](/)

***

# Class: LifecycleManager

Defined in: src/plugin/managers/lifecycle.ts:13

## Constructors

### Constructor

> **new LifecycleManager**(`discoveryManager`, `extensionRegistry`, `eventManager`): `LifecycleManager`

Defined in: src/plugin/managers/lifecycle.ts:16

#### Parameters

##### discoveryManager

[`DiscoveryManager`](../../discovery/classes/DiscoveryManager.md)

##### extensionRegistry

[`ExtensionRegistryManager`](../../extension-registry/classes/ExtensionRegistryManager.md)

##### eventManager

[`EventManager`](../../event-manager/classes/EventManager.md)

#### Returns

`LifecycleManager`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:142

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:178

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: src/plugin/managers/lifecycle.ts:53

#### Returns

`number`

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

Defined in: src/plugin/managers/lifecycle.ts:26

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

Defined in: src/plugin/managers/lifecycle.ts:22

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{ \}\>

Defined in: src/plugin/managers/lifecycle.ts:33

#### Parameters

##### pluginId

`string`

##### componentName

`string`

#### Returns

`ComponentType`\<\{ \}\>

***

### getPluginCount()

> **getPluginCount**(): `number`

Defined in: src/plugin/managers/lifecycle.ts:49

#### Returns

`number`

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:214

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:59

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:131

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

Defined in: src/plugin/managers/lifecycle.ts:268

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:103

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
