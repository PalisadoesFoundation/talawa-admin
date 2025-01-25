[Admin Docs](/) • **Docs**

***

# Class: default

Helper class for managing plugin-related tasks such as fetching store data, installed plugins, and generating plugin links.

## Constructors

### new default()

> **new default**(): [`default`](default.md)

#### Returns

[`default`](default.md)

## Methods

### fetchInstalled()

> **fetchInstalled**(): `Promise`\<`any`\>

Fetches the list of installed plugins from a local server.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the installed plugins data in JSON format.

#### Defined in

[src/components/AddOn/support/services/Plugin.helper.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L21)

***

### fetchStore()

> **fetchStore**(): `Promise`\<`any`\>

Fetches the store data from a local server.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the store data in JSON format.

#### Defined in

[src/components/AddOn/support/services/Plugin.helper.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L11)

***

### generateLinks()

> **generateLinks**(`plugins`): `object`[]

Generates an array of links for the enabled plugins.

#### Parameters

• **plugins**: `any`[]

An array of plugin objects.

#### Returns

`object`[]

An array of objects containing the name and URL of each enabled plugin.

#### Defined in

[src/components/AddOn/support/services/Plugin.helper.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L32)
