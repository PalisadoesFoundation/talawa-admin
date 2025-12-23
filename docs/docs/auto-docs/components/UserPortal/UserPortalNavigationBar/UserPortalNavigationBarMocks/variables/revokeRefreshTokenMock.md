[Admin Docs](/)

***

# Variable: revokeRefreshTokenMock

> `const` **revokeRefreshTokenMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L38)

Mock GraphQL mutation for revoking refresh token

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `REVOKE_REFRESH_TOKEN`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.revokeRefreshToken

> **revokeRefreshToken**: `boolean` = `true`
