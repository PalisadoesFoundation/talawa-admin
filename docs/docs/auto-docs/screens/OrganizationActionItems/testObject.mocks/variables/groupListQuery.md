[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [screens/OrganizationActionItems/testObject.mocks](../README.md) / groupListQuery

# Variable: groupListQuery

> `const` **groupListQuery**: `object`[]

Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:301](https://github.com/gautam-divyanshu/talawa-admin/blob/2490b2ea9583ec972ca984b1d93932def1c9f92b/src/screens/OrganizationActionItems/testObject.mocks.ts#L301)

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
