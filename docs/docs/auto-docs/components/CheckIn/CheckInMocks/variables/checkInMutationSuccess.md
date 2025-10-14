[Admin Docs](/)

***

# Variable: checkInMutationSuccess

> `const` **checkInMutationSuccess**: `object`[]

Defined in: [src/components/CheckIn/CheckInMocks.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/CheckIn/CheckInMocks.ts#L46)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `MARK_CHECKIN`

#### request.variables

> **variables**: `object`

#### request.variables.eventId

> **eventId**: `string` = `'event123'`

#### request.variables.userId

> **userId**: `string` = `'user123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.checkIn

> **checkIn**: `object`

#### result.data.checkIn.\_id

> **\_id**: `string` = `'123'`
