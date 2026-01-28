[**talawa-admin**](../../../../../README.md)

***

# Variable: logoutMock

> `const` **logoutMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:69](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L69)

Mock GraphQL mutation for logout
Using variableMatcher to match any variables

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `LOGOUT_MUTATION`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.logout

> **logout**: `object`

#### result.data.logout.success

> **success**: `boolean` = `true`

### variableMatcher()

> **variableMatcher**: () => `boolean`

#### Returns

`boolean`
