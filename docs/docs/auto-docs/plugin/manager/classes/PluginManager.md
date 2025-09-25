[Admin Docs](/)

***

# Class: PluginManager

Defined in: [src/plugin/manager.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L14)

## Constructors

### Constructor

> **new PluginManager**(`apolloClient?`): `PluginManager`

Defined in: [src/plugin/manager.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L21)

#### Parameters

##### apolloClient?

`any`

#### Returns

`PluginManager`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L102)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L106)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/manager.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L142)

#### Returns

`number`

***

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`, `userPermissions`, `isAdmin`, `isOrg?`): [`IExtensionRegistry`](../../types/interfaces/IExtensionRegistry.md)\[`T`\]

Defined in: [src/plugin/manager.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L147)

#### Type Parameters

##### T

`T` *extends* keyof [`IExtensionRegistry`](../../types/interfaces/IExtensionRegistry.md)

#### Parameters

##### type

`T`

##### userPermissions

`string`[] = `[]`

##### isAdmin

`boolean` = `false`

##### isOrg?

`boolean`

#### Returns

[`IExtensionRegistry`](../../types/interfaces/IExtensionRegistry.md)\[`T`\]

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)

Defined in: [src/plugin/manager.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L127)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)[]

Defined in: [src/plugin/manager.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L123)

#### Returns

[`ILoadedPlugin`](../../types/interfaces/ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{ \}\>

Defined in: [src/plugin/manager.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L131)

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

Defined in: [src/plugin/manager.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L138)

#### Returns

`number`

***

### initializePluginSystem()

> **initializePluginSystem**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L171)

#### Returns

`Promise`\<`void`\>

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L94)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### isSystemInitialized()

> **isSystemInitialized**(): `boolean`

Defined in: [src/plugin/manager.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L180)

#### Returns

`boolean`

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L86)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### off()

> **off**(`event`, `callback`): `void`

Defined in: [src/plugin/manager.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L166)

#### Parameters

##### event

`string`

##### callback

`Function`

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [src/plugin/manager.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L162)

#### Parameters

##### event

`string`

##### callback

`Function`

#### Returns

`void`

***

### refreshPluginDiscovery()

> **refreshPluginDiscovery**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L118)

#### Returns

`Promise`\<`void`\>

***

### setApolloClient()

> **setApolloClient**(`apolloClient`): `void`

Defined in: [src/plugin/manager.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L42)

#### Parameters

##### apolloClient

`any`

#### Returns

`void`

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L110)

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

Defined in: [src/plugin/manager.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L98)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/manager.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L90)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
