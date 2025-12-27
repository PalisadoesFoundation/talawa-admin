[**talawa-admin**](README.md)

***

# Variable: actionItemListQuery

> `const` **actionItemListQuery**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:297](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L297)

## Type declaration

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
