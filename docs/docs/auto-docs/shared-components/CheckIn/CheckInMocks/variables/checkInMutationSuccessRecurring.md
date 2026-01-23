[**talawa-admin**](../../../../README.md)

***

# Variable: checkInMutationSuccessRecurring

> `const` **checkInMutationSuccessRecurring**: `object`[]

Defined in: [src/shared-components/CheckIn/CheckInMocks.ts:104](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/shared-components/CheckIn/CheckInMocks.ts#L104)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `MARK_CHECKIN`

#### request.variables

> **variables**: `object`

#### request.variables.recurringEventInstanceId

> **recurringEventInstanceId**: `string` = `'recurring123'`

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
