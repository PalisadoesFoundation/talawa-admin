[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [screens/OrganizationActionItems/testObject.mocks](../README.md) / groupListQuery

# Variable: groupListQuery

> `const` **groupListQuery**: `object`[]

Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:301](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/screens/OrganizationActionItems/testObject.mocks.ts#L301)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_VOLUNTEER_GROUP_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.where

> **where**: `object`

#### request.variables.where.eventId

> **eventId**: `string` = `'eventId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getEventVolunteerGroups

> **getEventVolunteerGroups**: (\{ `_id`: `string`; `assignments`: `any`[]; `createdAt`: `string`; `creator`: \{ `_id`: `string`; `firstName`: `string`; `image`: `any`; `lastName`: `string`; \}; `description`: `string`; `event`: \{ `_id`: `string`; \}; `leader`: \{ `_id`: `string`; `firstName`: `string`; `image`: `any`; `lastName`: `string`; \}; `name`: `string`; `volunteers`: `object`[]; `volunteersRequired`: `number`; \} \| \{ `_id`: `undefined`; `assignments`: `any`[]; `createdAt`: `string`; `creator`: \{ `_id`: `string`; `firstName`: `string`; `image`: `any`; `lastName`: `string`; \}; `description`: `string`; `event`: \{ `_id`: `string`; \}; `leader`: \{ `_id`: `string`; `firstName`: `string`; `image`: `any`; `lastName`: `string`; \}; `name`: `string`; `volunteers`: `any`[]; `volunteersRequired`: `number`; \})[]
