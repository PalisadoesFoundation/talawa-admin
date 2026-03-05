[**talawa-admin**](../../../README.md)

***

# Function: refreshToken()

> **refreshToken**(): `Promise`\<`boolean`\>

Defined in: [src/utils/getRefreshToken.ts:13](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/getRefreshToken.ts#L13)

Refreshes the access token using HTTP-Only cookies.
The refresh token is automatically sent via cookies by the browser.
This function is called when the current access token expires.

## Returns

`Promise`\<`boolean`\>

Returns true if token refresh was successful, false otherwise
