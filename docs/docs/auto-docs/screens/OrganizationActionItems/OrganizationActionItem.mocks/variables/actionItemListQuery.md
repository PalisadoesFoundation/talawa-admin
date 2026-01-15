[**talawa-admin**](../../../../README.md)

***

# Variable: actionItemListQuery

> `const` **actionItemListQuery**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:300](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L300)

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

> **actionItemsByOrganization**: (\{ `assignedAt`: `Date`; `category`: \{ `createdAt`: `string`; `creatorId`: `string`; `id`: `string`; `isDisabled`: `boolean`; `name`: `string`; `organizationId`: `string`; `updatedAt`: `string`; \}; `categoryId`: `string`; `completionAt`: `any`; `createdAt`: `Date`; `creator`: \{ `avatarURL`: `any`; `emailAddress`: `string`; `id`: `string`; `name`: `string`; \}; `creatorId`: `string`; `event`: `any`; `eventId`: `any`; `id`: `string`; `isCompleted`: `boolean`; `organizationId`: `string`; `postCompletionNotes`: `any`; `preCompletionNotes`: `string`; `recurringEventInstance`: `any`; `recurringEventInstanceId`: `any`; `updatedAt`: `Date`; `updaterId`: `string`; `volunteer`: `any`; `volunteerGroup`: `any`; `volunteerGroupId`: `any`; `volunteerId`: `any`; \} \| \{ `assignedAt`: `Date`; `category`: `any`; `categoryId`: `any`; `completionAt`: `any`; `createdAt`: `Date`; `creator`: \{ `avatarURL`: `any`; `emailAddress`: `string`; `id`: `string`; `name`: `string`; \}; `creatorId`: `string`; `event`: `any`; `eventId`: `any`; `id`: `string`; `isCompleted`: `boolean`; `organizationId`: `string`; `postCompletionNotes`: `any`; `preCompletionNotes`: `string`; `recurringEventInstance`: `any`; `recurringEventInstanceId`: `any`; `updatedAt`: `Date`; `updaterId`: `string`; `volunteer`: \{ `hasAccepted`: `boolean`; `hoursVolunteered`: `number`; `id`: `string`; `isPublic`: `boolean`; `user`: \{ `avatarURL`: `string`; `id`: `string`; `name`: `string`; \}; \}; `volunteerGroup`: `any`; `volunteerGroupId`: `any`; `volunteerId`: `string`; \})[]
