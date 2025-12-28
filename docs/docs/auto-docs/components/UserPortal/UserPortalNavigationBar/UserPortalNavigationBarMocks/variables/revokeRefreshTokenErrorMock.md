[Admin Docs](/)

***

# Variable: revokeRefreshTokenErrorMock

> `const` **revokeRefreshTokenErrorMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L120)

Mock GraphQL error response for revoking refresh token
Used to test error handling during logout

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `REVOKE_REFRESH_TOKEN`

### variableMatcher()

> **variableMatcher**: () => `boolean`

#### Returns

`boolean`
