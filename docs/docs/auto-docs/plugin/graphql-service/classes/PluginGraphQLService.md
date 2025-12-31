[Admin Docs](/)

***

# Class: PluginGraphQLService

Defined in: [src/plugin/graphql-service.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L74)

## Constructors

### Constructor

> **new PluginGraphQLService**(`apolloClient`): `PluginGraphQLService`

Defined in: [src/plugin/graphql-service.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L77)

#### Parameters

##### apolloClient

`ApolloClient`

#### Returns

`PluginGraphQLService`

## Methods

### createPlugin()

> **createPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L94)

#### Parameters

##### input

[`ICreatePluginInput`](../interfaces/ICreatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### deletePlugin()

> **deletePlugin**(`input`): `Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

Defined in: [src/plugin/graphql-service.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L136)

#### Parameters

##### input

[`IDeletePluginInput`](../interfaces/IDeletePluginInput.md)

#### Returns

`Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

***

### getAllPlugins()

> **getAllPlugins**(): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

Defined in: [src/plugin/graphql-service.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L81)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

***

### installPlugin()

> **installPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L108)

#### Parameters

##### input

[`IInstallPluginInput`](../interfaces/IInstallPluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### updatePlugin()

> **updatePlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L122)

#### Parameters

##### input

[`IUpdatePluginInput`](../interfaces/IUpdatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>
