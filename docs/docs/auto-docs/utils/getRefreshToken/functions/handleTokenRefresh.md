[**talawa-admin**](../../../README.md)

***

# Function: handleTokenRefresh()

> **handleTokenRefresh**(): `Promise`\<`void`\>

Defined in: [src/utils/getRefreshToken.ts:45](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/utils/getRefreshToken.ts#L45)

Attempts to refresh the token and reload the page if successful.
Falls back to clearing storage and redirecting to login if refresh fails.

## Returns

`Promise`\<`void`\>
