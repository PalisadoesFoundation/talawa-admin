[Admin Docs](/)

***

# Class: PluginManager

Defined in: [src/plugin/manager.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L15)

## Constructors

### Constructor

> **new PluginManager**(`apolloClient?`): `PluginManager`

Defined in: [src/plugin/manager.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L22)

#### Parameters

##### apolloClient?

`ApolloClient`\<`unknown`\>

#### Returns

`PluginManager`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L103)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L107)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/manager.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L143)

#### Returns

`number`

***

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`): [`IExtensionRegistry`](../../types/interfaces/IExtensionRegistry.md)\[`T`\]

Defined in: [src/plugin/manager.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L148)

#### Type Parameters

##### T

`T` *extends* keyof [`IExtensionRegistry`](../../types/interfaces/IExtensionRegistry.md)

#### Parameters

##### type

`T`

#### Returns

[`IExtensionRegistry`](../../types/interfaces/IExtensionRegistry.md)\[`T`\]

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)

Defined in: [src/plugin/manager.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L128)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)[]

Defined in: [src/plugin/manager.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L124)

#### Returns

[`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{ \}\>

Defined in: [src/plugin/manager.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L132)

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

Defined in: [src/plugin/manager.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L139)

#### Returns

`number`

***

### initializePluginSystem()

> **initializePluginSystem**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L164)

#### Returns

`Promise`\<`void`\>

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L95)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### isSystemInitialized()

> **isSystemInitialized**(): `boolean`

Defined in: [src/plugin/manager.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L173)

#### Returns

`boolean`

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L87)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### off()

> **off**(`event`, `callback`): `void`

Defined in: [src/plugin/manager.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L159)

#### Parameters

##### event

`string`

##### callback

(...`args`) => `void`

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [src/plugin/manager.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L155)

#### Parameters

##### event

`string`

##### callback

(...`args`) => `void`

#### Returns

`void`

***

### refreshPluginDiscovery()

> **refreshPluginDiscovery**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L119)

#### Returns

`Promise`\<`void`\>

***

### setApolloClient()

> **setApolloClient**(`apolloClient`): `void`

Defined in: [src/plugin/manager.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L43)

#### Parameters

##### apolloClient

`ApolloClient`\<`unknown`\>

#### Returns

`void`

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L111)

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

Defined in: [src/plugin/manager.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L99)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L91)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
