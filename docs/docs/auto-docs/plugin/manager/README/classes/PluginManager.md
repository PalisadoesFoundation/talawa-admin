[Admin Docs](/)

***

# Class: PluginManager

Defined in: [src/plugin/manager.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L14)

## Constructors

### new PluginManager()

> **new PluginManager**(`apolloClient`?): `PluginManager`

Defined in: [src/plugin/manager.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L21)

#### Parameters

##### apolloClient?

`any`

#### Returns

`PluginManager`

## Methods

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/manager.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L121)

#### Returns

`number`

***

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`, `userPermissions`, `isAdmin`, `isOrg`?): [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)\[`T`\]

Defined in: [src/plugin/manager.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L126)

#### Type Parameters

##### T

`T` *extends* keyof [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

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

[`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)\[`T`\]

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)

Defined in: [src/plugin/manager.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L106)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)[]

Defined in: [src/plugin/manager.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L102)

#### Returns

[`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{\}\>

Defined in: [src/plugin/manager.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L110)

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

Defined in: [src/plugin/manager.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L117)

#### Returns

`number`

***

### initializePluginSystem()

> **initializePluginSystem**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L150)

#### Returns

`Promise`\<`void`\>

***

### isSystemInitialized()

> **isSystemInitialized**(): `boolean`

Defined in: [src/plugin/manager.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L159)

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

Defined in: [src/plugin/manager.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L145)

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

Defined in: [src/plugin/manager.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L141)

#### Parameters

##### event

`string`

##### callback

`Function`

#### Returns

`void`

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

Defined in: [src/plugin/manager.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L94)

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

Defined in: [src/plugin/manager.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L90)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
