[**talawa-admin**](../../../../../README.md)

***

# Variable: organizationDataNullMock

> `const` **organizationDataNullMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:148](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L148)

Mock GraphQL null data response for organization query
Used to test fallback behavior when data is null

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `GET_ORGANIZATION_BASIC_DATA`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `mockOrganizationId`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `any` = `null`
