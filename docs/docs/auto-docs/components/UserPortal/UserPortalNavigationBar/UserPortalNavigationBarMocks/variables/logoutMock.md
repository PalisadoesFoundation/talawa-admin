[**talawa-admin**](../../../../../README.md)

***

# Variable: logoutMock

> `const` **logoutMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:69](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L69)

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
