[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: `object`[]

Defined in: [src/components/AdminPortal/EventManagement/EventAttendance/EventAttendanceMocks.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/EventManagement/EventAttendance/EventAttendanceMocks.ts#L48)

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
