[Admin Docs](/)

***

# Variable: completeActionForInstanceMutationError

> `const` **completeActionForInstanceMutationError**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:403](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L403)

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `COMPLETE_ACTION_ITEM_FOR_INSTANCE`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.actionId

> **actionId**: `string` = `'actionItemId1'`

#### request.variables.input.eventId

> **eventId**: `string` = `'instanceId1'`

#### request.variables.input.postCompletionNotes

> **postCompletionNotes**: `string` = `'Valid completion notes'`
