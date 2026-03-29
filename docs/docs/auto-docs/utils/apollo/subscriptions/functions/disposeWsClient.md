[Admin Docs](/)

***

# Function: disposeWsClient()

> **disposeWsClient**(): `Promise`\<`void`\>

Defined in: [src/utils/apollo/subscriptions.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/apollo/subscriptions.ts#L75)

Idempotent cleanup function to dispose of the WebSocket client.
Safely handles errors and ensures the wsClient is nullified after disposal.
Safe to call multiple times.

## Returns

`Promise`\<`void`\>
