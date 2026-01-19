[Admin Docs](/)

---

# Variable: MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY

> `const` **MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY**: `object`[]

Defined in: [src/components/AdminPortal/OrgSettings/AgendaItemCategories/OrganizationAgendaCategoryErrorMocks.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/OrgSettings/AgendaItemCategories/OrganizationAgendaCategoryErrorMocks.ts#L5)

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `AGENDA_ITEM_CATEGORY_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.organizationId

> **organizationId**: `string` = `'123'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.name_contains

> **name_contains**: `string` = `''`
