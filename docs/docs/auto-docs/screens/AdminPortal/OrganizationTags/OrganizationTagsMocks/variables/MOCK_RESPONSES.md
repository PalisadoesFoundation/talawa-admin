[Admin Docs](/)

---

# Variable: MOCK_RESPONSES

> `const` **MOCK_RESPONSES**: `object`

Defined in: [src/screens/AdminPortal/OrganizationTags/OrganizationTagsMocks.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationTags/OrganizationTagsMocks.ts#L107)

## Type Declaration

### ASCENDING_NO_SEARCH

> **ASCENDING_NO_SEARCH**: `ListMock`[]

### DEFAULT

> **DEFAULT**: (`ListMock` \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; \}; \}; `result`: \{ `data`: \{ `createUserTag`: \{ `id`: `string`; \}; \}; \}; \})[]

### EMPTY

> **EMPTY**: `ListMock`[]

### ERROR_CREATE_TAG

> **ERROR_CREATE_TAG**: `object`[]

### ERROR_ORG

> **ERROR_ORG**: `ErrorMock`[]

### FETCHMORE_UNDEFINED

> **FETCHMORE_UNDEFINED**: `ListMock`[]

### NULL_END_CURSOR

> **NULL_END_CURSOR**: (`ListMock` \| \{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after`: `any`; `first`: `number`; `input`: \{ `id`: `string`; \}; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `name`: \{ `starts_with`: `string`; \}; \}; \}; \}; \})[]

### UNDEFINED_USER_TAGS

> **UNDEFINED_USER_TAGS**: `object`[]
