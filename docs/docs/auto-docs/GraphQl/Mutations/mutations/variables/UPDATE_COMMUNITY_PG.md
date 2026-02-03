[Admin Docs](/)

***

# Variable: UPDATE\_COMMUNITY\_PG

> `const` **UPDATE\_COMMUNITY\_PG**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:589](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/mutations.ts#L589)

GraphQL mutation to update community profile settings including logo upload.

## Param

Optional logo file (Upload scalar) - sent as multipart request via apollo-upload-client

## Param

Community name

## Param

Community website URL

## Param

Facebook profile URL

## Param

Instagram profile URL

## Param

X (Twitter) profile URL

## Param

GitHub organization URL

## Param

YouTube channel URL

## Param

LinkedIn profile URL

## Param

Reddit community URL

## Param

Slack workspace URL

## Param

Session timeout in minutes

## Returns

Updated community with id, logoURL (computed MinIO URL) and logoMimeType
