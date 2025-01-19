[Admin Docs](/)

***

# Class: default

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:5](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddOn/support/services/Plugin.helper.ts#L5)

Helper class for managing plugin-related tasks such as fetching store data, installed plugins, and generating plugin links.

## Constructors

### new default()

> **new default**(): [`default`](default.md)

#### Returns

[`default`](default.md)

## Methods

### fetchInstalled()

> **fetchInstalled**(): `Promise`\<`any`\>

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:21](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddOn/support/services/Plugin.helper.ts#L21)

Fetches the list of installed plugins from a local server.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the installed plugins data in JSON format.

***

### fetchStore()

> **fetchStore**(): `Promise`\<`any`\>

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:11](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddOn/support/services/Plugin.helper.ts#L11)

Fetches the store data from a local server.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the store data in JSON format.

***

### generateLinks()

> **generateLinks**(`plugins`): `object`[]

Defined in: [src/components/AddOn/support/services/Plugin.helper.ts:32](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddOn/support/services/Plugin.helper.ts#L32)

Generates an array of links for the enabled plugins.

#### Parameters

##### plugins

`any`[]

An array of plugin objects.

#### Returns

`object`[]

An array of objects containing the name and URL of each enabled plugin.
