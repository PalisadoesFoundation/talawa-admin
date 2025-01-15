[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../modules.md) / [GraphQl/Queries/OrganizationQueries](../README.md) / ORGANIZATION\_USER\_TAGS\_LIST

# Variable: ORGANIZATION\_USER\_TAGS\_LIST

> `const` **ORGANIZATION\_USER\_TAGS\_LIST**: `DocumentNode`

Defined in: [src/GraphQl/Queries/OrganizationQueries.ts:83](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/GraphQl/Queries/OrganizationQueries.ts#L83)

GraphQL query to retrieve the list of user tags belonging to an organization.

## Param

ID of the organization.

## Param

Number of tags to retrieve "after" (if provided) a certain tag.

## Param

Id of the last tag on the current page.

## Param

Number of tags to retrieve "before" (if provided) a certain tag.

## Param

Id of the first tag on the current page.

## Returns

The list of organizations based on the applied filters.
