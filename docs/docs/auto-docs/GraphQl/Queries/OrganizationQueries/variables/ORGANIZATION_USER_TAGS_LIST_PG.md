[Admin Docs](/)

***

# Variable: ORGANIZATION\_USER\_TAGS\_LIST\_PG

> `const` **ORGANIZATION\_USER\_TAGS\_LIST\_PG**: `DocumentNode`

Defined in: [src/GraphQl/Queries/OrganizationQueries.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Queries/OrganizationQueries.ts#L192)

GraphQL query to retrieve paginated organization user tags.

## Param

Object containing organization ID.

## Param

Number of tags to retrieve "after" (if provided) a certain tag.

## Param

Id of the last tag on the current page.

## Param

Number of tags to retrieve "before" (if provided) a certain tag.

## Param

Id of the first tag on the current page.

## Param

Filter criteria for tags.

## Param

Sort criteria for tags.

## Returns

Connection object with edges, pageInfo, and totalCount.
