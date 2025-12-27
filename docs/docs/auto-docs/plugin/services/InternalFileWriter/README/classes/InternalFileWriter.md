[**talawa-admin**](README.md)

***

# Class: InternalFileWriter

Defined in: [src/plugin/services/InternalFileWriter.ts:35](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L35)

Internal File Writer
Handles all file operations without external dependencies

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/plugin/services/InternalFileWriter.ts:92](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L92)

Initialize the file writer

#### Returns

`Promise`\<`void`\>

***

### listInstalledPlugins()

> **listInstalledPlugins**(): `Promise`\<\{ `error`: `string`; `plugins`: `object`[]; `success`: `boolean`; \}\>

Defined in: [src/plugin/services/InternalFileWriter.ts:209](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L209)

List installed plugin metadata

#### Returns

`Promise`\<\{ `error`: `string`; `plugins`: `object`[]; `success`: `boolean`; \}\>

***

### readPluginFiles()

> **readPluginFiles**(`pluginId`): `Promise`\<\{ `error`: `string`; `files`: `Record`\<`string`, `string`\>; `manifest`: [`IAdminPluginManifest`](utils\adminPluginInstaller\README\interfaces\IAdminPluginManifest.md); `success`: `boolean`; \}\>

Defined in: [src/plugin/services/InternalFileWriter.ts:164](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L164)

Read plugin files from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<\{ `error`: `string`; `files`: `Record`\<`string`, `string`\>; `manifest`: [`IAdminPluginManifest`](utils\adminPluginInstaller\README\interfaces\IAdminPluginManifest.md); `success`: `boolean`; \}\>

***

### removePlugin()

> **removePlugin**(`pluginId`): `Promise`\<[`IFileOperationResult`](plugin\services\InternalFileWriter\README\interfaces\IFileOperationResult.md)\>

Defined in: [src/plugin/services/InternalFileWriter.ts:255](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L255)

Remove plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IFileOperationResult`](plugin\services\InternalFileWriter\README\interfaces\IFileOperationResult.md)\>

***

### writePluginFiles()

> **writePluginFiles**(`pluginId`, `files`): `Promise`\<[`IFileWriteResult`](plugin\services\InternalFileWriter\README\interfaces\IFileWriteResult.md)\>

Defined in: [src/plugin/services/InternalFileWriter.ts:111](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L111)

Write plugin files to filesystem

#### Parameters

##### pluginId

`string`

##### files

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`IFileWriteResult`](plugin\services\InternalFileWriter\README\interfaces\IFileWriteResult.md)\>

***

### getInstance()

> `static` **getInstance**(): `InternalFileWriter`

Defined in: [src/plugin/services/InternalFileWriter.ts:49](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/plugin/services/InternalFileWriter.ts#L49)

Get singleton instance

#### Returns

`InternalFileWriter`
