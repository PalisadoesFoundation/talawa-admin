[Admin Docs](/)

***

# Function: runIfDirectExecution()

> **runIfDirectExecution**(`argv`, `currentFilePath`, `mainFn`, `errorHandler`): `void`

Defined in: [src/install/index.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/install/index.ts#L146)

Runs the main installation function if this file is executed directly.

## Parameters

### argv

`string`[] = `process.argv`

The command line arguments array to check. Defaults to process.argv.

### currentFilePath

`string` = `...`

The current file path to compare against argv[1]. Defaults to fileURLToPath(import.meta.url).

### mainFn

() => `Promise`\<`void`\>

The async main function to execute when direct execution is detected. Defaults to the exported main function.

### errorHandler

(`error`) => `void`

The error handler function to call if mainFn throws an error. Defaults to handleDirectExecutionError.

## Returns

`void`

void
