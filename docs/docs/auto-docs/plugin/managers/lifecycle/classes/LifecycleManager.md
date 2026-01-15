[Admin Docs](/)

***

# Class: LifecycleManager

Defined in: [src/plugin/managers/lifecycle.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L13)

## Constructors

### Constructor

> **new LifecycleManager**(`discoveryManager`, `extensionRegistry`, `eventManager`): `LifecycleManager`

Defined in: [src/plugin/managers/lifecycle.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L16)

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

Defined in: [src/plugin/managers/lifecycle.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L142)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L178)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/managers/lifecycle.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L53)

#### Returns

`number`

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

Defined in: [src/plugin/managers/lifecycle.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L26)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

Defined in: [src/plugin/managers/lifecycle.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L22)

#### Returns

[`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{ \}\>

Defined in: [src/plugin/managers/lifecycle.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L33)

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

Defined in: [src/plugin/managers/lifecycle.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L49)

#### Returns

`number`

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L214)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L59)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L131)

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

Defined in: [src/plugin/managers/lifecycle.ts:268](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L268)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L103)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
