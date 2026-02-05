[Admin Docs](/)

***

# Class: PluginGraphQLService

Defined in: [src/plugin/graphql-service.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L77)

## Constructors

### Constructor

> **new PluginGraphQLService**(`apolloClient`): `PluginGraphQLService`

Defined in: [src/plugin/graphql-service.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L80)

#### Parameters

##### apolloClient

`ApolloClient`

#### Returns

`PluginGraphQLService`

## Methods

### createPlugin()

> **createPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L97)

#### Parameters

##### input

[`ICreatePluginInput`](../interfaces/ICreatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### deletePlugin()

> **deletePlugin**(`input`): `Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

Defined in: [src/plugin/graphql-service.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L148)

#### Parameters

##### input

[`IDeletePluginInput`](../interfaces/IDeletePluginInput.md)

#### Returns

`Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

***

### getAllPlugins()

> **getAllPlugins**(): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

Defined in: [src/plugin/graphql-service.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L84)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

***

### installPlugin()

> **installPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L114)

#### Parameters

##### input

[`IInstallPluginInput`](../interfaces/IInstallPluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### updatePlugin()

> **updatePlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L131)

#### Parameters

##### input

[`IUpdatePluginInput`](../interfaces/IUpdatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>
