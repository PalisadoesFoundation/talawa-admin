[Admin Docs](/)

***

# Variable: ORGANIZATION\_USER\_TAGS\_LIST

> `const` **ORGANIZATION\_USER\_TAGS\_LIST**: `DocumentNode`

Defined in: [src/GraphQl/Queries/OrganizationQueries.ts:83](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/GraphQl/Queries/OrganizationQueries.ts#L83)

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