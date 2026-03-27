[Admin Docs](/)

***

# Function: disposeWsClient()

> **disposeWsClient**(): `Promise`\<`void`\>

Defined in: [src/apollo/subscriptions.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/apollo/subscriptions.ts#L76)

Idempotent cleanup function to dispose of the WebSocket client.
Safely handles errors and ensures the wsClient is nullified after disposal.
Safe to call multiple times.

## Returns

`Promise`\<`void`\>
