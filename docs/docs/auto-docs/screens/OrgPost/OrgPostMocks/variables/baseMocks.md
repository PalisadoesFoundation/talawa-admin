[Admin Docs](/)

***

# Variable: baseMocks

> `const` **baseMocks**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `user`: \{ `id`: `string`; `name`: `string`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `input`: \{ `id`: `string`; \}; `last`: `any`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `avatarURL`: `any`; `id`: `string`; `name`: `string`; `pinnedPosts`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; `postsCount`: `number`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `organizationId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `postsByOrganization`: `object`[]; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after`: `any`; `before`: `any`; `first`: `number`; `input`: \{ `id`: `string`; \}; `last`: `any`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `avatarURL`: `any`; `id`: `string`; `name`: `string`; `posts`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; `postsCount`: `number`; \}; \}; \}; \})[]

Defined in: [src/screens/OrgPost/OrgPostMocks.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPostMocks.ts#L191)
