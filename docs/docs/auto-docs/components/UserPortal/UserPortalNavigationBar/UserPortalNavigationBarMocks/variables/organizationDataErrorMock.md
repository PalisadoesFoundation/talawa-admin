[**talawa-admin**](../../../../../README.md)

***

# Variable: organizationDataErrorMock

> `const` **organizationDataErrorMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:108](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L108)

Mock GraphQL error response for fetching organization basic data
Used to test error handling when organization query fails

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `GET_ORGANIZATION_BASIC_DATA`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `mockOrganizationId`
