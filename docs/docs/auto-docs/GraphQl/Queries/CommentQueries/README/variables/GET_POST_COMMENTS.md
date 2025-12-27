[**talawa-admin**](README.md)

***

# Variable: GET\_POST\_COMMENTS

> `const` **GET\_POST\_COMMENTS**: `DocumentNode`

Defined in: [src/GraphQl/Queries/CommentQueries.ts:14](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/GraphQl/Queries/CommentQueries.ts#L14)

GraphQL query to retrieve post comments with cursor-based pagination.

## Param

The ID of the post to fetch comments for.

## Param

Cursor to fetch comments after this point (for load more).

## Param

Cursor to fetch comments before this point.

## Param

Number of comments to fetch (forward pagination).

## Param

Number of comments to fetch (backward pagination).

## Returns

Post with paginated comments using cursor-based pagination.
