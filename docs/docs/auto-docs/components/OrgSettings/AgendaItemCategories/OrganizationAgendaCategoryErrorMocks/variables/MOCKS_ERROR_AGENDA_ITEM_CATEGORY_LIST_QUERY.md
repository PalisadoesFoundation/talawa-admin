[Admin Docs](/)

***

# Variable: MOCKS\_ERROR\_AGENDA\_ITEM\_CATEGORY\_LIST\_QUERY

> `const` **MOCKS\_ERROR\_AGENDA\_ITEM\_CATEGORY\_LIST\_QUERY**: `object`[]

Defined in: [src/components/OrgSettings/AgendaItemCategories/OrganizationAgendaCategoryErrorMocks.ts:5](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/components/OrgSettings/AgendaItemCategories/OrganizationAgendaCategoryErrorMocks.ts#L5)

## Type declaration

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

#### request.variables.where.name\_contains

> **name\_contains**: `string` = `''`