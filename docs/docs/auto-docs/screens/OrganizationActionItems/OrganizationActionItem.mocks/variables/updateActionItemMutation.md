[Admin Docs](/)

***

# Variable: updateActionItemMutation

> `const` **updateActionItemMutation**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:295](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L295)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `UPDATE_ACTION_ITEM_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'actionItemId1'`

#### request.variables.input.isCompleted

> **isCompleted**: `boolean` = `true`

#### request.variables.input.postCompletionNotes

> **postCompletionNotes**: `string` = `'Cmp Notes 1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.updateActionItem

> **updateActionItem**: `object`

#### result.data.updateActionItem.id

> **id**: `string` = `'actionItemId1'`

#### result.data.updateActionItem.isCompleted

> **isCompleted**: `boolean` = `true`

#### result.data.updateActionItem.postCompletionNotes

> **postCompletionNotes**: `string` = `'Cmp Notes 1'`

#### result.data.updateActionItem.updatedAt

> **updatedAt**: `string` = `'2025-07-01T07:49:24Z'`
