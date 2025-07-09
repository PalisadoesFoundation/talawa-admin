[Admin Docs](/)

***

# Class: DiscoveryManager

Defined in: [src/plugin/managers/discovery.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L11)

## Constructors

### new DiscoveryManager()

> **new DiscoveryManager**(`graphqlService`?): `DiscoveryManager`

Defined in: [src/plugin/managers/discovery.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L15)

#### Parameters

##### graphqlService?

[`PluginGraphQLService`](../../../graphql-service/classes/PluginGraphQLService.md)

#### Returns

`DiscoveryManager`

## Methods

### discoverPlugins()

> **discoverPlugins**(): `Promise`\<`string`[]\>

Defined in: [src/plugin/managers/discovery.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L51)

#### Returns

`Promise`\<`string`[]\>

***

### findPluginInIndex()

> **findPluginInIndex**(`pluginId`): [`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)

Defined in: [src/plugin/managers/discovery.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L31)

#### Parameters

##### pluginId

`string`

#### Returns

[`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)

***

### getPluginIndex()

> **getPluginIndex**(): [`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)[]

Defined in: [src/plugin/managers/discovery.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L23)

#### Returns

[`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)[]

***

### isPluginActivated()

> **isPluginActivated**(`pluginId`): `boolean`

Defined in: [src/plugin/managers/discovery.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L35)

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### loadPluginComponents()

> **loadPluginComponents**(`pluginId`, `manifest`): `Promise`\<`Record`\<`string`, `ComponentType`\<\{\}\>\>\>

Defined in: [src/plugin/managers/discovery.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L106)

#### Parameters

##### pluginId

`string`

##### manifest

[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)

#### Returns

`Promise`\<`Record`\<`string`, `ComponentType`\<\{\}\>\>\>

***

### loadPluginIndexFromGraphQL()

> **loadPluginIndexFromGraphQL**(): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L40)

#### Returns

`Promise`\<`void`\>

***

### loadPluginManifest()

> **loadPluginManifest**(`pluginId`): `Promise`\<[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)\>

Defined in: [src/plugin/managers/discovery.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L77)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)\>

***

### removePluginFromGraphQL()

> **removePluginFromGraphQL**(`pluginId`): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L161)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`void`\>

***

### setGraphQLService()

> **setGraphQLService**(`service`): `void`

Defined in: [src/plugin/managers/discovery.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L19)

#### Parameters

##### service

[`PluginGraphQLService`](../../../graphql-service/classes/PluginGraphQLService.md)

#### Returns

`void`

***

### setPluginIndex()

> **setPluginIndex**(`index`): `void`

Defined in: [src/plugin/managers/discovery.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L27)

#### Parameters

##### index

[`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)[]

#### Returns

`void`

***

### syncPluginWithGraphQL()

> **syncPluginWithGraphQL**(`pluginId`): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L147)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`void`\>

***

### updatePluginStatusInGraphQL()

> **updatePluginStatusInGraphQL**(`pluginId`, `status`): `Promise`\<`void`\>

Defined in: [src/plugin/managers/discovery.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/discovery.ts#L178)

#### Parameters

##### pluginId

`string`

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`void`\>
