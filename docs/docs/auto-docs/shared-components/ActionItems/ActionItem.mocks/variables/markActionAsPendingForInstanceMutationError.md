[Admin Docs](/)

***

# Variable: markActionAsPendingForInstanceMutationError

> `const` **markActionAsPendingForInstanceMutationError**: `object`

Defined in: [src/shared-components/ActionItems/ActionItem.mocks.ts:507](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ActionItems/ActionItem.mocks.ts#L507)

## Type Declaration

### error

> **error**: `Error`

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
