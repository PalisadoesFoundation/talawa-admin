[Admin Docs](/)

***

# Variable: MOCKS\_FETCHMORE\_UNDEFINED

> `const` **MOCKS\_FETCHMORE\_UNDEFINED**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after?`: `undefined`; `first`: `number`; `input`: \{ `id`: `string`; \}; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `name`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `organizations`: `object`[]; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after`: `string`; `first`: `number`; `input`: \{ `id`: `string`; \}; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `name`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: `any`; \}; \})[]

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:454](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L454)

Mock for testing fetchMore when fetchMoreResult is undefined
This returns undefined data to trigger the line 129 check
