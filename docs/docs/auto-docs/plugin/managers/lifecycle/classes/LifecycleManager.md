[Admin Docs](/)

***

# Class: LifecycleManager

Defined in: src/plugin/managers/lifecycle.ts:12

## Constructors

### new LifecycleManager()

> **new LifecycleManager**(`discoveryManager`, `extensionRegistry`, `eventManager`): `LifecycleManager`

Defined in: src/plugin/managers/lifecycle.ts:15

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

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: src/plugin/managers/lifecycle.ts:52

#### Returns

`number`

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

Defined in: src/plugin/managers/lifecycle.ts:25

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

Defined in: src/plugin/managers/lifecycle.ts:21

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{\}\>

Defined in: src/plugin/managers/lifecycle.ts:32

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

Defined in: src/plugin/managers/lifecycle.ts:48

#### Returns

`number`

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:58

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:124

#### Parameters

##### pluginId

`string`

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: src/plugin/managers/lifecycle.ts:96

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
