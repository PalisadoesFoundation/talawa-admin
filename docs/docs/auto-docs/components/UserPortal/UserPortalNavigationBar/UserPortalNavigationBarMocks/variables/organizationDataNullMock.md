[**talawa-admin**](../../../../../README.md)

***

# Variable: organizationDataNullMock

> `const` **organizationDataNullMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:148](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L148)

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
