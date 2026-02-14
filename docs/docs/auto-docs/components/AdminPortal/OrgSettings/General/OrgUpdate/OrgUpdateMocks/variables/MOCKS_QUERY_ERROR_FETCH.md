[Admin Docs](/)

***

# Variable: MOCKS\_QUERY\_ERROR\_FETCH

> `const` **MOCKS\_QUERY\_ERROR\_FETCH**: `object`[]

Defined in: [src/components/AdminPortal/OrgSettings/General/OrgUpdate/OrgUpdateMocks.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/OrgSettings/General/OrgUpdate/OrgUpdateMocks.ts#L109)

Query error with alternate message for "displays error message when query fails" test.

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `GET_ORGANIZATION_BASIC_DATA`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `'1'`
