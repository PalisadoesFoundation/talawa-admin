[**talawa-admin**](../../../../../README.md)

***

# Variable: organizationDataErrorMock

> `const` **organizationDataErrorMock**: `object`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts:108](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBarMocks.ts#L108)

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
