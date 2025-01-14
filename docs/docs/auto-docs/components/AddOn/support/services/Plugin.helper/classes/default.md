[**talawa-admin**](../../../../../../README.md)

***

[talawa-admin](../../../../../../README.md) / [components/AddOn/support/services/Plugin.helper](../README.md) / default

# Class: default

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:5](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/components/AddOn/support/services/Plugin.helper.ts#L5)

Helper class for managing plugin-related tasks such as fetching store data, installed plugins, and generating plugin links.

## Constructors

### new default()

> **new default**(): [`default`](default.md)

#### Returns

[`default`](default.md)

## Methods

### fetchInstalled()

> **fetchInstalled**(): `Promise`\<`any`\>

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:21](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/components/AddOn/support/services/Plugin.helper.ts#L21)

Fetches the list of installed plugins from a local server.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the installed plugins data in JSON format.

***

### fetchStore()

> **fetchStore**(): `Promise`\<`any`\>

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:11](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/components/AddOn/support/services/Plugin.helper.ts#L11)

Fetches the store data from a local server.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the store data in JSON format.

***

### generateLinks()

> **generateLinks**(`plugins`): `object`[]

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:32](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/components/AddOn/support/services/Plugin.helper.ts#L32)

Generates an array of links for the enabled plugins.

#### Parameters

##### plugins

`any`[]

An array of plugin objects.

#### Returns

`object`[]

An array of objects containing the name and URL of each enabled plugin.
