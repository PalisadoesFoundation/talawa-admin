[Admin Docs](/)

***

# Function: refreshToken()

> **refreshToken**(): `Promise`\<`boolean`\>

Defined in: [src/utils/getRefreshToken.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/getRefreshToken.ts#L12)

Refreshes the access token using the stored refresh token.
This function is called when the current access token expires.

## Returns

`Promise`\<`boolean`\>

Returns true if token refresh was successful, false otherwise
