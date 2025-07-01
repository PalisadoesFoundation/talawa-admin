[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `organizationId`: `string`; \}; \}; `result`: \{ `data`: \{ `usersByOrganizationId`: `object`[]; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `organizationId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `actionCategoriesByOrganization`: `object`[]; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `organizationId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `actionItemsByOrganization`: `object`[]; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `id`: `string`; `isCompleted`: `boolean`; `postCompletionNotes`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `updateActionItem`: \{ `id`: `string`; `isCompleted`: `boolean`; `postCompletionNotes`: `string`; `updatedAt`: `string`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `markActionItemAsPending`: \{ `id`: `string`; `isCompleted`: `boolean`; `postCompletionNotes`: `any`; `updatedAt`: `string`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `deleteActionItem`: \{ `id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L316)
