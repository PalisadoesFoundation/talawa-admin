[**talawa-admin**](../../../../../README.md)

***

# Variable: MOCKS

> `const` **MOCKS**: `object`[]

Defined in: [src/components/EventManagement/EventAttendance/EventAttendanceMocks.ts:48](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/EventManagement/EventAttendance/EventAttendanceMocks.ts#L48)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_ATTENDEES`

#### request.variables

> **variables**: `object`

#### request.variables.eventId

> **eventId**: `string` = `'event123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.event

> **event**: `object`

#### result.data.event.attendees

> **attendees**: (\{ `avatarURL`: `any`; `birthDate`: `any`; `createdAt`: `string`; `emailAddress`: `string`; `eventsAttended`: `object`[]; `id`: `string`; `name`: `string`; `natalSex`: `any`; `role`: `string`; `tagsAssignedWith?`: `undefined`; \} \| \{ `avatarURL`: `any`; `birthDate`: `any`; `createdAt`: `string`; `emailAddress`: `string`; `eventsAttended`: `any`; `id`: `string`; `name`: `string`; `natalSex`: `any`; `role`: `string`; `tagsAssignedWith`: \{ `edges`: `object`[]; \}; \})[]
