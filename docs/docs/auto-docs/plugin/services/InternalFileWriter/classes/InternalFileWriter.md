[Admin Docs](/)

***

# Class: InternalFileWriter

Defined in: [src/plugin/services/InternalFileWriter.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L28)

Internal File Writer
Handles all file operations without external dependencies

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/plugin/services/InternalFileWriter.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L88)

Initialize the file writer

#### Returns

`Promise`\<`void`\>

***

### listInstalledPlugins()

> **listInstalledPlugins**(): `Promise`\<\{ `error?`: `string`; `plugins?`: `object`[]; `success`: `boolean`; \}\>

Defined in: [src/plugin/services/InternalFileWriter.ts:201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L201)

List all installed plugins

#### Returns

`Promise`\<\{ `error?`: `string`; `plugins?`: `object`[]; `success`: `boolean`; \}\>

***

### readPluginFiles()

> **readPluginFiles**(`pluginId`): `Promise`\<\{ `error?`: `string`; `files?`: `Record`\<`string`, `string`\>; `manifest?`: [`AdminPluginManifest`](../../../../utils/adminPluginInstaller/interfaces/AdminPluginManifest.md); `success`: `boolean`; \}\>

Defined in: [src/plugin/services/InternalFileWriter.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L155)

Read plugin files from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<\{ `error?`: `string`; `files?`: `Record`\<`string`, `string`\>; `manifest?`: [`AdminPluginManifest`](../../../../utils/adminPluginInstaller/interfaces/AdminPluginManifest.md); `success`: `boolean`; \}\>

***

### removePlugin()

> **removePlugin**(`pluginId`): `Promise`\<[`FileOperationResult`](../interfaces/FileOperationResult.md)\>

Defined in: [src/plugin/services/InternalFileWriter.ts:247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L247)

Remove plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`FileOperationResult`](../interfaces/FileOperationResult.md)\>

***

### writePluginFiles()

> **writePluginFiles**(`pluginId`, `files`): `Promise`\<[`FileWriteResult`](../interfaces/FileWriteResult.md)\>

Defined in: [src/plugin/services/InternalFileWriter.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L108)

Write plugin files to filesystem

#### Parameters

##### pluginId

`string`

##### files

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`FileWriteResult`](../interfaces/FileWriteResult.md)\>

***

### getInstance()

> `static` **getInstance**(): `InternalFileWriter`

Defined in: [src/plugin/services/InternalFileWriter.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L42)

Get singleton instance

#### Returns

`InternalFileWriter`
