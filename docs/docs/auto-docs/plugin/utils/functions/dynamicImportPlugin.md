[Admin Docs](/)

***

# Function: dynamicImportPlugin()

> **dynamicImportPlugin**(`pluginId`): `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [src/plugin/utils.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/utils.ts#L94)

Dynamically imports a plugin module
Extracted for better testability

## Parameters

### pluginId

`string`

The unique identifier of the plugin to import

## Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

## Throws

Error if pluginId is empty or contains invalid characters
