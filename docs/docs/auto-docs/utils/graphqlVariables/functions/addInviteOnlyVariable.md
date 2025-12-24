[Admin Docs](/)

***

# Function: addInviteOnlyVariable()

> **addInviteOnlyVariable**\<`T`\>(`variables`): `T` & `object`

Defined in: [src/utils/graphqlVariables.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/graphqlVariables.ts#L39)

Adds the includeInviteOnly variable to query variables based on feature flag.
For mutations with an input object, also conditionally includes input.isInviteOnly
to ensure backward compatibility with older backends.

Use this helper when calling queries or mutations that support the isInviteOnly field
to ensure the field is only queried/sent when the backend supports it.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>

## Parameters

### variables

`T`

Existing query/mutation variables

## Returns

`T` & `object`

Variables object with includeInviteOnly added and input.isInviteOnly conditionally included

## Example

```ts
// For queries
const { data } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
  variables: addInviteOnlyVariable({
    id: orgId,
    first: 10,
  }),
});

// For mutations
await create({
  variables: addInviteOnlyVariable({
    input: {
      name: 'Event',
      isInviteOnly: true, // Will be omitted if feature flag is disabled
    },
  }),
});
```
