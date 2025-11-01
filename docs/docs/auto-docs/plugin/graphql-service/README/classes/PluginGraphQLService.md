[Admin Docs](/)

***

# Class: PluginGraphQLService

Defined in: [src/plugin/graphql-service.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L63)

## Constructors

### new PluginGraphQLService()

> **new PluginGraphQLService**(`apolloClient`): `PluginGraphQLService`

Defined in: [src/plugin/graphql-service.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L66)

#### Parameters

##### apolloClient

`any`

#### Returns

`PluginGraphQLService`

## Methods

### createPlugin()

> **createPlugin**(`input`): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L83)

#### Parameters

##### input

[`CreatePluginInput`](plugin\graphql-service\README\interfaces\CreatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

***

### deletePlugin()

> **deletePlugin**(`input`): `Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

Defined in: [src/plugin/graphql-service.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L111)

#### Parameters

##### input

[`DeletePluginInput`](plugin\graphql-service\README\interfaces\DeletePluginInput.md)

#### Returns

`Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

***

### getAllPlugins()

> **getAllPlugins**(): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]\>

Defined in: [src/plugin/graphql-service.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L70)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]\>

***

### updatePlugin()

> **updatePlugin**(`input`): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L97)

#### Parameters

##### input

[`UpdatePluginInput`](plugin\graphql-service\README\interfaces\UpdatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>
