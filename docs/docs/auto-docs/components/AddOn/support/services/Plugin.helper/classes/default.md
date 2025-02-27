[Admin Docs](/)

***

# Class: default

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L4)

Helper class for managing plugin-related tasks such as fetching store data, installed plugins, and generating plugin links.

## Constructors

### new default()

> **new default**(): [`default`](default.md)

#### Returns

[`default`](default.md)

## Methods

### fetchInstalled()

> **fetchInstalled**(): `Promise`\<`unknown`\>

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L20)

Fetches the list of installed plugins from a local server.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves to the installed plugins data in JSON format.

***

### fetchStore()

> **fetchStore**(): `Promise`\<`unknown`\>

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L10)

Fetches the store data from a local server.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves to the store data in JSON format.

***

### generateLinks()

> **generateLinks**(`plugins`): `object`[]

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/services/Plugin.helper.ts#L33)

Generates an array of links for the enabled plugins.

#### Parameters

##### plugins

`object`[]

An array of plugin objects.

#### Returns

`object`[]

An array of objects containing the name and URL of each enabled plugin.
