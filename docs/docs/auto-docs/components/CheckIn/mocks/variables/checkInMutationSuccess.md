[Admin Docs](/)

***

# Variable: checkInMutationSuccess

> `const` **checkInMutationSuccess**: `object`[]

Defined in: [src/components/CheckIn/mocks.ts:46](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/components/CheckIn/mocks.ts#L46)

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

#### result.data.checkIn.\_id

> **\_id**: `string` = `'123'`
