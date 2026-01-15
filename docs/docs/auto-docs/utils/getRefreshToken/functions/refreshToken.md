[**talawa-admin**](../../../README.md)

***

# Function: refreshToken()

> **refreshToken**(): `Promise`\<`boolean`\>

Defined in: [src/utils/getRefreshToken.ts:13](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/getRefreshToken.ts#L13)

Refreshes the access token using HTTP-Only cookies.
The refresh token is automatically sent via cookies by the browser.
This function is called when the current access token expires.

## Returns

`Promise`\<`boolean`\>

Returns true if token refresh was successful, false otherwise
