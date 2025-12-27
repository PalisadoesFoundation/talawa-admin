[Admin Docs](/)

***

# Class: AdminPluginFileService

Defined in: [src/plugin/services/AdminPluginFileService.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L46)

Production-First Plugin File Service
Writes actual files to the filesystem for production deployment

## Methods

### getInstalledPlugins()

> **getInstalledPlugins**(): `Promise`\<[`InstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\InstalledPlugin.md)[]\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:293](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L293)

Get all installed plugins from filesystem

#### Returns

`Promise`\<[`InstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\InstalledPlugin.md)[]\>

***

### getPlugin()

> **getPlugin**(`pluginId`): `Promise`\<[`InstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\InstalledPlugin.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L318)

Get specific plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`InstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\InstalledPlugin.md)\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `message`: `string`; `status`: `"error"` \| `"healthy"`; \}\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:354](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L354)

Health check for the service

#### Returns

`Promise`\<\{ `message`: `string`; `status`: `"error"` \| `"healthy"`; \}\>

***

### installPlugin()

> **installPlugin**(`pluginId`, `files`): `Promise`\<[`PluginInstallationResult`](plugin\services\AdminPluginFileService\README\interfaces\PluginInstallationResult.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L173)

Install plugin files to filesystem (Production-First)

#### Parameters

##### pluginId

`string`

##### files

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`PluginInstallationResult`](plugin\services\AdminPluginFileService\README\interfaces\PluginInstallationResult.md)\>

***

### removePlugin()

> **removePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L341)

Remove plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### validatePluginFiles()

> **validatePluginFiles**(`files`): [`PluginFileValidationResult`](plugin\services\AdminPluginFileService\README\interfaces\PluginFileValidationResult.md)

Defined in: [src/plugin/services/AdminPluginFileService.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L64)

Validate plugin files structure

#### Parameters

##### files

`Record`\<`string`, `string`\>

#### Returns

[`PluginFileValidationResult`](plugin\services\AdminPluginFileService\README\interfaces\PluginFileValidationResult.md)

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

> `static` **getPluginDetails**(`pluginId`): `Promise`\<[`IPluginDetails`](plugin\types\README\interfaces\IPluginDetails.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:376](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/AdminPluginFileService.ts#L376)

Get comprehensive plugin details from local files

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginDetails`](plugin\types\README\interfaces\IPluginDetails.md)\>
