[Admin Docs](/)

***

# Variable: MOCKS\_DRAG\_DROP

> `const` **MOCKS\_DRAG\_DROP**: `object`[]

Defined in: [src/components/AdminPortal/AgendaItems/AgendaItemsMocks.ts:246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/AgendaItems/AgendaItemsMocks.ts#L246)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `UPDATE_AGENDA_ITEM_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.sequence

> **sequence**: `number` = `2`

#### request.variables.updateAgendaItemId

> **updateAgendaItemId**: `string` = `'agendaItem1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.updateAgendaItem

> **updateAgendaItem**: `object`

#### result.data.updateAgendaItem.\_\_typename

> **\_\_typename**: `string` = `'AgendaItem'`

#### result.data.updateAgendaItem.\_id

> **\_id**: `string` = `'agendaItem1'`
