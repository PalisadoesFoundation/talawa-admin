[Admin Docs](/)

***

# Class: InternalFileWriter

Defined in: [src/plugin/services/InternalFileWriter.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L28)

Internal File Writer
Handles all file operations without external dependencies

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/plugin/services/InternalFileWriter.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L65)

Initialize the file writer

#### Returns

`Promise`\<`void`\>

***

### listInstalledPlugins()

> **listInstalledPlugins**(): `Promise`\<\{ `error?`: `string`; `plugins?`: `object`[]; `success`: `boolean`; \}\>

Defined in: [src/plugin/services/InternalFileWriter.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L174)

List all installed plugins

#### Returns

`Promise`\<\{ `error?`: `string`; `plugins?`: `object`[]; `success`: `boolean`; \}\>

***

### readPluginFiles()

> **readPluginFiles**(`pluginId`): `Promise`\<\{ `error?`: `string`; `files?`: `Record`\<`string`, `string`\>; `manifest?`: [`AdminPluginManifest`](../../../../utils/adminPluginInstaller/interfaces/AdminPluginManifest.md); `success`: `boolean`; \}\>

Defined in: [src/plugin/services/InternalFileWriter.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L128)

Read plugin files from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<\{ `error?`: `string`; `files?`: `Record`\<`string`, `string`\>; `manifest?`: [`AdminPluginManifest`](../../../../utils/adminPluginInstaller/interfaces/AdminPluginManifest.md); `success`: `boolean`; \}\>

***

### removePlugin()

> **removePlugin**(`pluginId`): `Promise`\<[`FileOperationResult`](../interfaces/FileOperationResult.md)\>

Defined in: [src/plugin/services/InternalFileWriter.ts:220](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L220)

Remove plugin from filesystem

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`FileOperationResult`](../interfaces/FileOperationResult.md)\>

***

### writePluginFiles()

> **writePluginFiles**(`pluginId`, `files`): `Promise`\<[`FileWriteResult`](../interfaces/FileWriteResult.md)\>

Defined in: [src/plugin/services/InternalFileWriter.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L81)

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

Defined in: [src/plugin/services/InternalFileWriter.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/services/InternalFileWriter.ts#L41)

Get singleton instance

#### Returns

`InternalFileWriter`
