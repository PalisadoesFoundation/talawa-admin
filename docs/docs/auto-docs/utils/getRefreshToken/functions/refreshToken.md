[**talawa-admin**](../../../README.md)

***

# Function: refreshToken()

> **refreshToken**(): `Promise`\<`boolean`\>

Defined in: [src/utils/getRefreshToken.ts:13](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/utils/getRefreshToken.ts#L13)

Refreshes the access token using HTTP-Only cookies.
The refresh token is automatically sent via cookies by the browser.
This function is called when the current access token expires.

## Returns

`Promise`\<`boolean`\>

Returns true if token refresh was successful, false otherwise
