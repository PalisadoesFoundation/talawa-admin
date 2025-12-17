[Admin Docs](/)

***

# Class: PluginGraphQLService

Defined in: src/plugin/graphql-service.ts:82

## Constructors

### Constructor

> **new PluginGraphQLService**(`apolloClient`): `PluginGraphQLService`

Defined in: src/plugin/graphql-service.ts:85

#### Parameters

##### apolloClient

`ApolloClient`\<`unknown`\>

#### Returns

`PluginGraphQLService`

## Methods

### createPlugin()

> **createPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: src/plugin/graphql-service.ts:102

#### Parameters

##### input

[`ICreatePluginInput`](../interfaces/ICreatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### deletePlugin()

> **deletePlugin**(`input`): `Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

Defined in: src/plugin/graphql-service.ts:144

#### Parameters

##### input

[`IDeletePluginInput`](../interfaces/IDeletePluginInput.md)

#### Returns

`Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

***

### getAllPlugins()

> **getAllPlugins**(): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

Defined in: src/plugin/graphql-service.ts:89

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

***

### installPlugin()

> **installPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: src/plugin/graphql-service.ts:116

#### Parameters

##### input

[`IInstallPluginInput`](../interfaces/IInstallPluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### updatePlugin()

> **updatePlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: src/plugin/graphql-service.ts:130

#### Parameters

##### input

[`IUpdatePluginInput`](../interfaces/IUpdatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>
