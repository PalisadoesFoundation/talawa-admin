[Admin Docs](/)

***

# Variable: deleteActionItemForInstanceMutation

> `const` **deleteActionItemForInstanceMutation**: `object`

Defined in: [src/shared-components/ActionItems/ActionItem.mocks.ts:421](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ActionItems/ActionItem.mocks.ts#L421)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `DELETE_ACTION_ITEM_FOR_INSTANCE`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.actionId

> **actionId**: `string` = `'actionItemId1'`

#### request.variables.input.eventId

> **eventId**: `string` = `'event123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.deleteActionItemForInstance

> **deleteActionItemForInstance**: `object`

#### result.data.deleteActionItemForInstance.id

> **id**: `string` = `'actionItemId1'`
