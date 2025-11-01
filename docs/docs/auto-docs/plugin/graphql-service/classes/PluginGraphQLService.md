[Admin Docs](/)

***

# Class: PluginGraphQLService

Defined in: [src/plugin/graphql-service.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L72)

## Constructors

### Constructor

> **new PluginGraphQLService**(`apolloClient`): `PluginGraphQLService`

Defined in: [src/plugin/graphql-service.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L75)

#### Parameters

##### apolloClient

`any`

#### Returns

`PluginGraphQLService`

## Methods

### createPlugin()

> **createPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L92)

#### Parameters

##### input

[`CreatePluginInput`](../interfaces/CreatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### deletePlugin()

> **deletePlugin**(`input`): `Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

Defined in: [src/plugin/graphql-service.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L134)

#### Parameters

##### input

[`DeletePluginInput`](../interfaces/DeletePluginInput.md)

#### Returns

`Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

***

### getAllPlugins()

> **getAllPlugins**(): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

Defined in: [src/plugin/graphql-service.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L79)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)[]\>

***

### installPlugin()

> **installPlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L106)

#### Parameters

##### input

[`InstallPluginInput`](../interfaces/InstallPluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

***

### updatePlugin()

> **updatePlugin**(`input`): `Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/graphql-service.ts#L120)

#### Parameters

##### input

[`UpdatePluginInput`](../interfaces/UpdatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](../interfaces/IPlugin.md)\>
