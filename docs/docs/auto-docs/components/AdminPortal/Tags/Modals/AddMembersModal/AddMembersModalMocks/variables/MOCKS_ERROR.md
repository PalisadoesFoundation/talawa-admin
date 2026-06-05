[Admin Docs](/)

***

# Variable: MOCKS\_ERROR

> `const` **MOCKS\_ERROR**: `object`[]

Defined in: [src/components/AdminPortal/Tags/Modals/AddMembersModal/AddMembersModalMocks.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/Tags/Modals/AddMembersModal/AddMembersModalMocks.ts#L169)

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAGS_MEMBERS_TO_ASSIGN_TO`

#### request.variables

> **variables**: `object` = `baseMemberQueryVariables`

#### request.variables.first

> **first**: `number` = `TAGS_QUERY_DATA_CHUNK_SIZE`

#### request.variables.organizationId

> **organizationId**: `string` = `'1'`

#### request.variables.tagId

> **tagId**: `string` = `'1'`
