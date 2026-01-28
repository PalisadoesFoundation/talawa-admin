[**talawa-admin**](../../../README.md)

***

# Function: refreshToken()

> **refreshToken**(): `Promise`\<`boolean`\>

Defined in: [src/utils/getRefreshToken.ts:13](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/utils/getRefreshToken.ts#L13)

Refreshes the access token using HTTP-Only cookies.
The refresh token is automatically sent via cookies by the browser.
This function is called when the current access token expires.

## Returns

`Promise`\<`boolean`\>

Returns true if token refresh was successful, false otherwise
