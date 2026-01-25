[**talawa-admin**](../../../../README.md)

***

# Variable: completeActionForInstanceMutation

> `const` **completeActionForInstanceMutation**: `object`

Defined in: [src/shared-components/ActionItems/ActionItem.mocks.ts:454](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/ActionItems/ActionItem.mocks.ts#L454)

## Type Declaration

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

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.completeActionForInstance

> **completeActionForInstance**: `object`

#### result.data.completeActionForInstance.id

> **id**: `string` = `'actionItemId1'`
