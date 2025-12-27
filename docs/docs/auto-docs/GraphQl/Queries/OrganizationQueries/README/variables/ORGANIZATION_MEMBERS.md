[**talawa-admin**](README.md)

***

# Variable: ORGANIZATION\_MEMBERS

> `const` **ORGANIZATION\_MEMBERS**: `DocumentNode`

Defined in: [src/GraphQl/Queries/OrganizationQueries.ts:333](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/GraphQl/Queries/OrganizationQueries.ts#L333)

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
