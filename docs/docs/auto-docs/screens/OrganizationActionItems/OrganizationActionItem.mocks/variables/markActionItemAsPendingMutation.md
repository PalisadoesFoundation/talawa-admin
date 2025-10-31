[Admin Docs](/)

***

# Variable: markActionItemAsPendingMutation

> `const` **markActionItemAsPendingMutation**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L318)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `MARK_ACTION_ITEM_AS_PENDING_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'actionItemId1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.markActionItemAsPending

> **markActionItemAsPending**: `object`

#### result.data.markActionItemAsPending.id

> **id**: `string` = `'actionItemId1'`

#### result.data.markActionItemAsPending.isCompleted

> **isCompleted**: `boolean` = `false`

#### result.data.markActionItemAsPending.postCompletionNotes

> **postCompletionNotes**: `any` = `null`

#### result.data.markActionItemAsPending.updatedAt

> **updatedAt**: `string` = `'2025-07-01T07:49:24Z'`
