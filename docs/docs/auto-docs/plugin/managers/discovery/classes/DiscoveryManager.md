[Admin Docs](/)

***

# Class: DiscoveryManager

Defined in: src/plugin/managers/discovery.ts:11

## Constructors

### Constructor

> **new DiscoveryManager**(`graphqlService?`): `DiscoveryManager`

Defined in: src/plugin/managers/discovery.ts:15

#### Parameters

##### graphqlService?

[`PluginGraphQLService`](../../../graphql-service/classes/PluginGraphQLService.md)

#### Returns

`DiscoveryManager`

## Methods

### discoverPlugins()

> **discoverPlugins**(): `Promise`\<`string`[]\>

Defined in: src/plugin/managers/discovery.ts:56

#### Returns

`Promise`\<`string`[]\>

***

### findPluginInIndex()

> **findPluginInIndex**(`pluginId`): [`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)

Defined in: src/plugin/managers/discovery.ts:31

#### Parameters

##### pluginId

`string`

#### Returns

[`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)

***

### getPluginIndex()

> **getPluginIndex**(): [`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)[]

Defined in: src/plugin/managers/discovery.ts:23

#### Returns

[`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)[]

***

### isPluginActivated()

> **isPluginActivated**(`pluginId`): `boolean`

Defined in: src/plugin/managers/discovery.ts:35

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### isPluginInstalled()

> **isPluginInstalled**(`pluginId`): `boolean`

Defined in: src/plugin/managers/discovery.ts:40

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### loadPluginComponents()

> **loadPluginComponents**(`pluginId`, `manifest`): `Promise`\<`Record`\<`string`, `ComponentType`\<\{ \}\>\>\>

Defined in: src/plugin/managers/discovery.ts:116

#### Parameters

##### pluginId

`string`

##### manifest

[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)

#### Returns

`Promise`\<`Record`\<`string`, `ComponentType`\<\{ \}\>\>\>

***

### loadPluginIndexFromGraphQL()

> **loadPluginIndexFromGraphQL**(): `Promise`\<`void`\>

Defined in: src/plugin/managers/discovery.ts:45

#### Returns

`Promise`\<`void`\>

***

### loadPluginManifest()

> **loadPluginManifest**(`pluginId`): `Promise`\<[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)\>

Defined in: src/plugin/managers/discovery.ts:79

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)\>

***

### removePluginFromGraphQL()

> **removePluginFromGraphQL**(`pluginId`): `Promise`\<`void`\>

Defined in: src/plugin/managers/discovery.ts:160

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`void`\>

***

### setGraphQLService()

> **setGraphQLService**(`service`): `void`

Defined in: src/plugin/managers/discovery.ts:19

#### Parameters

##### service

[`PluginGraphQLService`](../../../graphql-service/classes/PluginGraphQLService.md)

#### Returns

`void`

***

### setPluginIndex()

> **setPluginIndex**(`index`): `void`

Defined in: src/plugin/managers/discovery.ts:27

#### Parameters

##### index

[`IPlugin`](../../../graphql-service/interfaces/IPlugin.md)[]

#### Returns

`void`

***

### syncPluginWithGraphQL()

> **syncPluginWithGraphQL**(`pluginId`): `Promise`\<`void`\>

Defined in: src/plugin/managers/discovery.ts:146

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`void`\>

***

### updatePluginStatusInGraphQL()

> **updatePluginStatusInGraphQL**(`pluginId`, `status`): `Promise`\<`void`\>

Defined in: src/plugin/managers/discovery.ts:177

#### Parameters

##### pluginId

`string`

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`void`\>
