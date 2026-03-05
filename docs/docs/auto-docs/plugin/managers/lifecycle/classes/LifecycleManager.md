[Admin Docs](/)

***

# Class: LifecycleManager

Defined in: [src/plugin/managers/lifecycle.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L20)

## Constructors

### Constructor

> **new LifecycleManager**(`discoveryManager`, `extensionRegistry`, `eventManager`): `LifecycleManager`

Defined in: [src/plugin/managers/lifecycle.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L23)

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

Defined in: [src/plugin/managers/lifecycle.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L149)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L185)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/managers/lifecycle.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L60)

#### Returns

`number`

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

Defined in: [src/plugin/managers/lifecycle.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L33)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

Defined in: [src/plugin/managers/lifecycle.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L29)

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{ \}\>

Defined in: [src/plugin/managers/lifecycle.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L40)

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

Defined in: [src/plugin/managers/lifecycle.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L56)

#### Returns

`number`

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:221](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L221)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L66)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L138)

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

Defined in: [src/plugin/managers/lifecycle.ts:275](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L275)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L110)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
