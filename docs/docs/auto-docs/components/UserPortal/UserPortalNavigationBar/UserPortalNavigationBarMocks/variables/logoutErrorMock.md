[Admin Docs](/)

***

# Variable: logoutErrorMock

> `const` **logoutErrorMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L120)

Mock GraphQL error response for logout
Used to test error handling during logout

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `LOGOUT_MUTATION`

### variableMatcher()

> **variableMatcher**: () => `boolean`

#### Returns

`boolean`
