[Admin Docs](/)

***

# Function: getPluginMapPollsResolver()

> **getPluginMapPollsResolver**(`_parent`, `args`, `ctx`): `Promise`\<\{ `hasMore`: `boolean`; `polls`: `any`; `totalCount`: `any`; \}\>

Defined in: src/plugin/available/plugin\_map/api/graphql/queries.ts:237

Resolver to fetch all logged polls.

Similar to `getPluginMapRequestsResolver`, but exposed as a generic poll fetcher.

## Parameters

### \_parent

`unknown`

The parent resolver (unused).

### args

The arguments containing filter criteria.

#### input?

\{ `extensionPoint?`: `string`; `organizationId?`: `string`; `userRole?`: `string`; \}

#### input.extensionPoint?

`string`

#### input.organizationId?

`string`

#### input.userRole?

`string`

### ctx

`GraphQLContext`

The GraphQL context.

## Returns

`Promise`\<\{ `hasMore`: `boolean`; `polls`: `any`; `totalCount`: `any`; \}\>

A paginated list of polls.

## Throws

If the user is unauthenticated or arguments are invalid.
