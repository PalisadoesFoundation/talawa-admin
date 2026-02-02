[Admin Docs](/)

***

# Function: runIfDirectExecution()

> **runIfDirectExecution**(`argv`, `currentFilePath`, `mainFn`, `errorHandler`): `void`

Defined in: [src/install/index.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/install/index.ts#L142)

Runs the main installation function if this file is executed directly

## Parameters

### argv

`string`[] = `process.argv`

The argv array to check (defaults to process.argv)

### currentFilePath

`string` = `...`

### mainFn

() => `Promise`\<`void`\>

### errorHandler

(`error`) => `void`

## Returns

`void`
