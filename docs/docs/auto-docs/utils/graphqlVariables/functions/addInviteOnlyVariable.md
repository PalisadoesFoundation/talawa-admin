[Admin Docs](/)

***

# Function: addInviteOnlyVariable()

> **addInviteOnlyVariable**\<`T`\>(`variables`): `T` & `object`

Defined in: [src/utils/graphqlVariables.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/graphqlVariables.ts#L25)

Adds the includeInviteOnly variable to query variables based on feature flag.
Use this helper when calling queries that support the isInviteOnly field to ensure
the field is only queried when the backend supports it.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>

## Parameters

### variables

`T`

Existing query variables

## Returns

`T` & `object`

Variables object with includeInviteOnly added based on REACT_APP_ENABLE_INVITE_ONLY

## Example

```ts
const { data } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
  variables: addInviteOnlyVariable({
    id: orgId,
    first: 10,
  }),
});
```
