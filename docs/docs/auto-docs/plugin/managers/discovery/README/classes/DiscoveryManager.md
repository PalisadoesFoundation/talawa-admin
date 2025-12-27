[**talawa-admin**](README.md)

***

# Class: DiscoveryManager

Defined in: [src/plugin/managers/discovery.ts:11](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L11)

## Constructors

### new DiscoveryManager()

> **new DiscoveryManager**(`graphqlService`?): `DiscoveryManager`

Defined in: [src/plugin/managers/discovery.ts:15](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L15)

#### Parameters

##### graphqlService?

[`PluginGraphQLService`](plugin\graphql-service\README\classes\PluginGraphQLService.md)

#### Returns

`DiscoveryManager`

## Methods

### discoverPlugins()

> **discoverPlugins**(): `Promise`\<`string`[]\>

Defined in: [src/plugin/managers/discovery.ts:56](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L56)

#### Returns

`Promise`\<`string`[]\>

***

### findPluginInIndex()

> **findPluginInIndex**(`pluginId`): [`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)

Defined in: [src/plugin/managers/discovery.ts:31](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L31)

#### Parameters

##### pluginId

`string`

#### Returns

[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)

***

### getPluginIndex()

> **getPluginIndex**(): [`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]

Defined in: [src/plugin/managers/discovery.ts:23](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L23)

#### Returns

[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]

***

### isPluginActivated()

> **isPluginActivated**(`pluginId`): `boolean`

Defined in: [src/plugin/managers/discovery.ts:35](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L35)

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### isPluginInstalled()

> **isPluginInstalled**(`pluginId`): `boolean`

Defined in: [src/plugin/managers/discovery.ts:40](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L40)

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### loadPluginComponents()

> **loadPluginComponents**(`pluginId`, `manifest`): `Promise`\<`Record`\<`string`, `ComponentType`\<\{\}\>\>\>

Defined in: [src/plugin/managers/discovery.ts:116](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L116)

#### Parameters

##### pluginId

`string`

##### manifest

[`IPluginManifest`](plugin\types\README\interfaces\IPluginManifest.md)

#### Returns

`Promise`\<`Record`\<`string`, `ComponentType`\<\{\}\>\>\>

***

### loadPluginIndexFromGraphQL()

> **loadPluginIndexFromGraphQL**(): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:45](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L45)

#### Returns

`Promise`\<`void`\>

***

### loadPluginManifest()

> **loadPluginManifest**(`pluginId`): `Promise`\<[`IPluginManifest`](plugin\types\README\interfaces\IPluginManifest.md)\>

Defined in: [src/plugin/managers/discovery.ts:79](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L79)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginManifest`](plugin\types\README\interfaces\IPluginManifest.md)\>

***

### removePluginFromGraphQL()

> **removePluginFromGraphQL**(`pluginId`): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:160](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L160)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`void`\>

***

### setGraphQLService()

> **setGraphQLService**(`service`): `void`

Defined in: [src/plugin/managers/discovery.ts:19](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L19)

#### Parameters

##### service

[`PluginGraphQLService`](plugin\graphql-service\README\classes\PluginGraphQLService.md)

#### Returns

`void`

***

### setPluginIndex()

> **setPluginIndex**(`index`): `void`

Defined in: [src/plugin/managers/discovery.ts:27](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L27)

#### Parameters

##### index

[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]

#### Returns

`void`

***

### syncPluginWithGraphQL()

> **syncPluginWithGraphQL**(`pluginId`): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:146](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L146)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`void`\>

***

### updatePluginStatusInGraphQL()

> **updatePluginStatusInGraphQL**(`pluginId`, `status`): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:177](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/discovery.ts#L177)

#### Parameters

##### pluginId

`string`

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`void`\>
