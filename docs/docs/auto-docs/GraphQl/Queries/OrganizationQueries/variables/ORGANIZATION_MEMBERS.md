[**talawa-admin**](../../../../README.md)

***

# Variable: ORGANIZATION\_MEMBERS

> `const` **ORGANIZATION\_MEMBERS**: `DocumentNode`

Defined in: [src/GraphQl/Queries/OrganizationQueries.ts:364](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/GraphQl/Queries/OrganizationQueries.ts#L364)

GraphQL query to fetch organization members with pagination and filtering.
This query uses the new connection-based schema with input objects.

## Param

QueryOrganizationInput containing the organization ID

## Param

Number of members to fetch

## Param

Cursor for pagination

## Param

MembersWhereInput for filtering (e.g., name_contains)

## Returns

Organization members with connection structure
