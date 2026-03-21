[Admin Docs](/)

***

# Function: initializePluginSystemOnce()

> **initializePluginSystemOnce**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager.ts:203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/manager.ts#L203)

Initializes the plugin system once.
Prevents duplicate work from concurrent calls and allows retry on failure.

## Returns

`Promise`\<`void`\>
