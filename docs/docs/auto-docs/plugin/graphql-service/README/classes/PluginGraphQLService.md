[**talawa-admin**](README.md)

***

# Class: PluginGraphQLService

Defined in: [src/plugin/graphql-service.ts:82](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L82)

## Constructors

### new PluginGraphQLService()

> **new PluginGraphQLService**(`apolloClient`): `PluginGraphQLService`

Defined in: [src/plugin/graphql-service.ts:85](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L85)

#### Parameters

##### apolloClient

`ApolloClient`\<`unknown`\>

#### Returns

`PluginGraphQLService`

## Methods

### createPlugin()

> **createPlugin**(`input`): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:102](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L102)

#### Parameters

##### input

[`ICreatePluginInput`](plugin\graphql-service\README\interfaces\ICreatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

***

### deletePlugin()

> **deletePlugin**(`input`): `Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

Defined in: [src/plugin/graphql-service.ts:144](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L144)

#### Parameters

##### input

[`IDeletePluginInput`](plugin\graphql-service\README\interfaces\IDeletePluginInput.md)

#### Returns

`Promise`\<\{ `id`: `string`; `pluginId`: `string`; \}\>

***

### getAllPlugins()

> **getAllPlugins**(): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]\>

Defined in: [src/plugin/graphql-service.ts:89](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L89)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)[]\>

***

### installPlugin()

> **installPlugin**(`input`): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:116](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L116)

#### Parameters

##### input

[`IInstallPluginInput`](plugin\graphql-service\README\interfaces\IInstallPluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

***

### updatePlugin()

> **updatePlugin**(`input`): `Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>

Defined in: [src/plugin/graphql-service.ts:130](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/graphql-service.ts#L130)

#### Parameters

##### input

[`IUpdatePluginInput`](plugin\graphql-service\README\interfaces\IUpdatePluginInput.md)

#### Returns

`Promise`\<[`IPlugin`](plugin\graphql-service\README\interfaces\IPlugin.md)\>
