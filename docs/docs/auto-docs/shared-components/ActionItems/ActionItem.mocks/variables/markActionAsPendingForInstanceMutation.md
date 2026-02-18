[Admin Docs](/)

***

# Variable: markActionAsPendingForInstanceMutation

> `const` **markActionAsPendingForInstanceMutation**: `object`

Defined in: [src/shared-components/ActionItems/ActionItem.mocks.ts:488](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ActionItems/ActionItem.mocks.ts#L488)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `MARK_ACTION_ITEM_AS_PENDING_FOR_INSTANCE`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.actionId

> **actionId**: `string` = `'actionItemId1'`

#### request.variables.input.eventId

> **eventId**: `string` = `'instanceId1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.markActionAsPendingForInstance

> **markActionAsPendingForInstance**: `object`

#### result.data.markActionAsPendingForInstance.id

> **id**: `string` = `'actionItemId1'`
