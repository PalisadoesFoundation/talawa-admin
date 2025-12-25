[Admin Docs](/)

***

# Variable: revokeRefreshTokenMock

> `const` **revokeRefreshTokenMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L39)

Mock GraphQL mutation for revoking refresh token
Using variableMatcher to match any refresh token string

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `REVOKE_REFRESH_TOKEN`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.revokeRefreshTokenForUser

> **revokeRefreshTokenForUser**: `boolean` = `true`

### variableMatcher()

> **variableMatcher**: () => `boolean`

#### Returns

`boolean`
