[**talawa-admin**](README.md)

***

# Class: AdminPluginFileService

Defined in: [src/plugin/services/AdminPluginFileService.ts:46](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L46)

Production-First Plugin File Service
Writes actual files to the filesystem for production deployment

## Methods

### getInstalledPlugins()

> **getInstalledPlugins**(): `Promise`\<[`IInstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\IInstalledPlugin.md)[]\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:300](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L300)

Get all installed plugins from filesystem

#### Returns

`Promise`\<[`IInstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\IInstalledPlugin.md)[]\>

***

### getPlugin()

> **getPlugin**(`pluginId`): `Promise`\<[`IInstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\IInstalledPlugin.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:325](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L325)

Get specific plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IInstalledPlugin`](plugin\services\AdminPluginFileService\README\interfaces\IInstalledPlugin.md)\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `message`: `string`; `status`: `"error"` \| `"healthy"`; \}\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:361](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L361)

Health check for the service

#### Returns

`Promise`\<\{ `message`: `string`; `status`: `"error"` \| `"healthy"`; \}\>

***

### installPlugin()

> **installPlugin**(`pluginId`, `files`): `Promise`\<[`IPluginInstallationResult`](plugin\services\AdminPluginFileService\README\interfaces\IPluginInstallationResult.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:173](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L173)

Install plugin files to filesystem (Production-First)

#### Parameters

##### pluginId

`string`

##### files

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`IPluginInstallationResult`](plugin\services\AdminPluginFileService\README\interfaces\IPluginInstallationResult.md)\>

***

### removePlugin()

> **removePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:348](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L348)

Remove plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### validatePluginFiles()

> **validatePluginFiles**(`files`): [`IPluginFileValidationResult`](plugin\services\AdminPluginFileService\README\interfaces\IPluginFileValidationResult.md)

Defined in: [src/plugin/services/AdminPluginFileService.ts:64](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L64)

Validate plugin files structure

#### Parameters

##### files

`Record`\<`string`, `string`\>

#### Returns

[`IPluginFileValidationResult`](plugin\services\AdminPluginFileService\README\interfaces\IPluginFileValidationResult.md)

***

### validatePluginId()

> **validatePluginId**(`pluginId`): `object`

Defined in: [src/plugin/services/AdminPluginFileService.ts:143](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L143)

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

Defined in: [src/plugin/services/AdminPluginFileService.ts:54](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L54)

Get singleton instance

#### Returns

`AdminPluginFileService`

***

### getPluginDetails()

> `static` **getPluginDetails**(`pluginId`): `Promise`\<[`IPluginDetails`](plugin\types\README\interfaces\IPluginDetails.md)\>

Defined in: [src/plugin/services/AdminPluginFileService.ts:383](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/services/AdminPluginFileService.ts#L383)

Get comprehensive plugin details from local files

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginDetails`](plugin\types\README\interfaces\IPluginDetails.md)\>
