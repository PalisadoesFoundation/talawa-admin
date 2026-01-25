[**talawa-admin**](../../../../README.md)

***

# Variable: GET\_POST\_COMMENTS

> `const` **GET\_POST\_COMMENTS**: `DocumentNode`

Defined in: [src/GraphQl/Queries/CommentQueries.ts:14](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/GraphQl/Queries/CommentQueries.ts#L14)

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
