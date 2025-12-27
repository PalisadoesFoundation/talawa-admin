[**talawa-admin**](README.md)

***

# Variable: checkInMutationSuccess

> `const` **checkInMutationSuccess**: `object`[]

Defined in: [src/components/CheckIn/CheckInMocks.ts:63](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/components/CheckIn/CheckInMocks.ts#L63)

## Type declaration

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

#### result.data.checkIn.checkinTime

> **checkinTime**: `string` = `'2023-01-01T08:00:00Z'`

#### result.data.checkIn.checkoutTime

> **checkoutTime**: `any` = `null`

#### result.data.checkIn.feedbackSubmitted

> **feedbackSubmitted**: `boolean` = `false`

#### result.data.checkIn.id

> **id**: `string` = `'123'`

#### result.data.checkIn.isCheckedIn

> **isCheckedIn**: `boolean` = `true`

#### result.data.checkIn.isCheckedOut

> **isCheckedOut**: `boolean` = `false`

#### result.data.checkIn.user

> **user**: `object`

#### result.data.checkIn.user.id

> **id**: `string` = `'user123'`
