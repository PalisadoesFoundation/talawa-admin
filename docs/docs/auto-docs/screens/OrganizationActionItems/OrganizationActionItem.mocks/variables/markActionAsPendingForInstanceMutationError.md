[Admin Docs](/)

***

# Variable: markActionAsPendingForInstanceMutationError

> `const` **markActionAsPendingForInstanceMutationError**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:436](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L436)

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
