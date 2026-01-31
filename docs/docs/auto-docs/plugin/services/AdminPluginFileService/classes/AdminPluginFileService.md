[Admin Docs](/)

***

# Class: AdminPluginFileService

Defined in: [src/plugin/services/AdminPluginFileService.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L46)

Production-First Plugin File Service
Writes actual files to the filesystem for production deployment

## Methods

### getInstalledPlugins()

> **getInstalledPlugins**(): `Promise`\<[`IInstalledPlugin`](../interfaces/IInstalledPlugin.md)[]\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:300](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L300)

Get all installed plugins from filesystem

#### Returns

`Promise`\<[`IInstalledPlugin`](../interfaces/IInstalledPlugin.md)[]\>

***

### getPlugin()

> **getPlugin**(`pluginId`): `Promise`\<[`IInstalledPlugin`](../interfaces/IInstalledPlugin.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L325)

Get specific plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IInstalledPlugin`](../interfaces/IInstalledPlugin.md)\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `message`: `string`; `status`: `"error"` \| `"healthy"`; \}\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:361](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L361)

Health check for the service

#### Returns

`Promise`\<\{ `message`: `string`; `status`: `"error"` \| `"healthy"`; \}\>

***

### installPlugin()

> **installPlugin**(`pluginId`, `files`): `Promise`\<[`IPluginInstallationResult`](../interfaces/IPluginInstallationResult.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L173)

Install plugin files to filesystem (Production-First)

#### Parameters

##### pluginId

`string`

##### files

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`IPluginInstallationResult`](../interfaces/IPluginInstallationResult.md)\>

***

### removePlugin()

> **removePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:348](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L348)

Remove plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### validatePluginFiles()

> **validatePluginFiles**(`files`): [`IPluginFileValidationResult`](../interfaces/IPluginFileValidationResult.md)

Defined in: [src/plugin/services/AdminPluginFileService.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L64)

Validate plugin files structure

#### Parameters

##### files

`Record`\<`string`, `string`\>

#### Returns

[`IPluginFileValidationResult`](../interfaces/IPluginFileValidationResult.md)

***

### validatePluginId()

> **validatePluginId**(`pluginId`): `object`

Defined in: [src/plugin/services/AdminPluginFileService.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L143)

Validate plugin ID

#### Parameters

##### pluginId

`string`

#### Returns

`object`

##### error?

> `optional` **error**: `string`

##### valid

> **valid**: `boolean`

***

### getInstance()

> `static` **getInstance**(): `AdminPluginFileService`

Defined in: [src/plugin/services/AdminPluginFileService.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L54)

Get singleton instance

#### Returns

`AdminPluginFileService`

***

### getPluginDetails()

> `static` **getPluginDetails**(`pluginId`): `Promise`\<[`IPluginDetails`](../../../types/interfaces/IPluginDetails.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:383](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L383)

Get comprehensive plugin details from local files

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginDetails`](../../../types/interfaces/IPluginDetails.md)\>
