[**talawa-admin**](../../../../README.md)

***

# Variable: GET\_POST\_COMMENTS

> `const` **GET\_POST\_COMMENTS**: `DocumentNode`

Defined in: [src/GraphQl/Queries/CommentQueries.ts:14](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/GraphQl/Queries/CommentQueries.ts#L14)

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
