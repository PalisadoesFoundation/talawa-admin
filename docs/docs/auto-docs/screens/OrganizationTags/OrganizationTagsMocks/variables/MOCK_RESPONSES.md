[Admin Docs](/)

***

# Variable: MOCK\_RESPONSES

> `const` **MOCK\_RESPONSES**: `object`

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L133)

## Type Declaration

### ASCENDING\_NO\_SEARCH

> **ASCENDING\_NO\_SEARCH**: `ListMock`[]

### DEFAULT

> **DEFAULT**: (`ListMock` \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; \}; \}; `result`: \{ `data`: \{ `createUserTag`: \{ `id`: `string`; \}; \}; \}; \})[]

### EMPTY

> **EMPTY**: `ListMock`[]

### ERROR\_CREATE\_TAG

> **ERROR\_CREATE\_TAG**: `object`[]

### ERROR\_ORG

> **ERROR\_ORG**: `ErrorMock`[]

### FETCHMORE\_UNDEFINED

> **FETCHMORE\_UNDEFINED**: `ListMock`[]

### NULL\_END\_CURSOR

> **NULL\_END\_CURSOR**: (`ListMock` \| \{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after`: `any`; `first`: `number`; `id`: `string`; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `name`: \{ `starts_with`: `string`; \}; \}; \}; \}; \})[]

### UNDEFINED\_USER\_TAGS

> **UNDEFINED\_USER\_TAGS**: `object`[]
