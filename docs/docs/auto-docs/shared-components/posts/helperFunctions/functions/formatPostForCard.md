[Admin Docs](/)

***

# Function: formatPostForCard()

> **formatPostForCard**(`post`, `t`, `refetch`): `Omit`\<[`InterfacePostCard`](../../../../utils/interfaces/interfaces/InterfacePostCard.md), `"image"` \| `"video"`\>

Defined in: [src/shared-components/posts/helperFunctions.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/posts/helperFunctions.ts#L25)

Formats a post object to match the PostCard component's expected interface.

This function transforms a raw post object from the GraphQL API into the format
required by the PostCard component, handling missing values with appropriate fallbacks
and formatting dates safely.

## Parameters

### post

[`InterfacePost`](../../../../types/Post/interface/interfaces/InterfacePost.md)

The raw post object from the API

### t

(`key`) => `string`

Translation function for internationalized text

### refetch

() => `Promise`\<`unknown`\>

Function to refetch posts data, typically from Apollo Client

## Returns

`Omit`\<[`InterfacePostCard`](../../../../utils/interfaces/interfaces/InterfacePostCard.md), `"image"` \| `"video"`\>

An object formatted to match the InterfacePostCard interface

## Example

```tsx
const formattedPost = formatPostForCard(rawPost, t, refetch);
<PostCard {...formattedPost} />
```
