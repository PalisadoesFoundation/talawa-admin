[Admin Docs](/)

***

# Function: handleTokenRefresh()

> **handleTokenRefresh**(): `Promise`\<`void`\>

Defined in: [src/utils/getRefreshToken.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/getRefreshToken.ts#L45)

Attempts to refresh the token and reload the page if successful.
Falls back to clearing storage and redirecting to login if refresh fails.

## Returns

`Promise`\<`void`\>
