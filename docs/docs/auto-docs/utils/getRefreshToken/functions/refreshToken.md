[Admin Docs](/)

***

# Function: refreshToken()

> **refreshToken**(): `Promise`\<`string`\>

Defined in: [src/utils/getRefreshToken.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/getRefreshToken.ts#L13)

Refreshes the access token using the HTTP-Only cookie refresh token.
This function is called when the current access token expires.
The refresh token is stored in an HTTP-Only cookie and is sent automatically
by the browser with the request.

## Returns

`Promise`\<`string`\>

Returns the new access token if successful, null otherwise
