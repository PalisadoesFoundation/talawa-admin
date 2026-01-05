[Admin Docs](/)

***

# Function: clearPluginMapPollsResolver()

> **clearPluginMapPollsResolver**(`_parent`, `_args`, `ctx`): `Promise`\<\{ `clearedCount`: `any`; `message`: `string`; `success`: `boolean`; \}\>

Defined in: src/plugin/available/plugin\_map/api/graphql/mutations.ts:240

Resolver to clear all logged plugin map polls.

Distinct from `clearPluginMapRequestsResolver` only in name/schema exposure,
intended for clearing generic poll logs.

## Parameters

### \_parent

`unknown`

The parent resolver (unused).

### \_args

`Record`\<`string`, `unknown`\>

The arguments (unused).

### ctx

`GraphQLContext`

The GraphQL context.

## Returns

`Promise`\<\{ `clearedCount`: `any`; `message`: `string`; `success`: `boolean`; \}\>

An object indicating success and the count of cleared records.

## Throws

If the user is unauthenticated.
