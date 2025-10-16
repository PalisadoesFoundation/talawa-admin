[Admin Docs](/)

***

# Variable: actionItemListQuery

> `const` **actionItemListQuery**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:227](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L227)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ACTION_ITEM_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.organizationId

> **organizationId**: `string` = `'orgId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.actionItemsByOrganization

> **actionItemsByOrganization**: (\{ `assignedAt`: `Date`; `assignee`: `any`; `assigneeId`: `any`; `category`: \{ `createdAt`: `string`; `creatorId`: `string`; `id`: `string`; `isDisabled`: `boolean`; `name`: `string`; `organizationId`: `string`; `updatedAt`: `string`; \}; `categoryId`: `string`; `completionAt`: `any`; `createdAt`: `Date`; `creator`: \{ `avatarURL`: `any`; `emailAddress`: `string`; `id`: `string`; `name`: `string`; \}; `creatorId`: `string`; `event`: `any`; `eventId`: `any`; `id`: `string`; `isCompleted`: `boolean`; `organizationId`: `string`; `postCompletionNotes`: `any`; `preCompletionNotes`: `string`; `updatedAt`: `Date`; `updaterId`: `string`; \} \| \{ `assignedAt`: `Date`; `assignee`: \{ `avatarURL`: `string`; `emailAddress`: `string`; `id`: `string`; `name`: `string`; \}; `assigneeId`: `string`; `category`: `any`; `categoryId`: `any`; `completionAt`: `any`; `createdAt`: `Date`; `creator`: \{ `avatarURL`: `any`; `emailAddress`: `string`; `id`: `string`; `name`: `string`; \}; `creatorId`: `string`; `event`: `any`; `eventId`: `any`; `id`: `string`; `isCompleted`: `boolean`; `organizationId`: `string`; `postCompletionNotes`: `any`; `preCompletionNotes`: `string`; `updatedAt`: `Date`; `updaterId`: `string`; \})[]
