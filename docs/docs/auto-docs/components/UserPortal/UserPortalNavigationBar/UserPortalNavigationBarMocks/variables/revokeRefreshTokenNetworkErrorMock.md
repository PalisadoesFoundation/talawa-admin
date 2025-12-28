[Admin Docs](/)

***

# Variable: revokeRefreshTokenNetworkErrorMock

> `const` **revokeRefreshTokenNetworkErrorMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L102)

Mock network error for revoking refresh token
Simulates network failure during logout

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `REVOKE_REFRESH_TOKEN`

### result

> **result**: `object`

#### result.errors

> **errors**: `object`[]

### variableMatcher()

> **variableMatcher**: () => `boolean`

#### Returns

`boolean`
