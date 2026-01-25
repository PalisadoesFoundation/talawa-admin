[**talawa-admin**](../../../../README.md)

***

# Variable: checkInMutationSuccess

> `const` **checkInMutationSuccess**: `object`[]

Defined in: [src/shared-components/CheckIn/CheckInMocks.ts:64](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/CheckIn/CheckInMocks.ts#L64)

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

#### result.data.checkIn.checkinTime

> **checkinTime**: `string`

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
