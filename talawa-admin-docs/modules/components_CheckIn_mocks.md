[talawa-admin](../README.md) / [Modules](../modules.md) / components/CheckIn/mocks

# Module: components/CheckIn/mocks

## Table of contents

### Variables

- [checkInMutationSuccess](components_CheckIn_mocks.md#checkinmutationsuccess)
- [checkInMutationUnsuccess](components_CheckIn_mocks.md#checkinmutationunsuccess)
- [checkInQueryMock](components_CheckIn_mocks.md#checkinquerymock)

## Variables

### checkInMutationSuccess

• `Const` **checkInMutationSuccess**: \{ `request`: \{ `query`: `DocumentNode` = MARK\_CHECKIN; `variables`: \{ `allotedRoom`: `string` = ''; `allotedSeat`: `string` = ''; `eventId`: `string` = 'event123'; `userId`: `string` = 'user123' \}  \} ; `result`: \{ `data`: \{ `checkIn`: \{ `_id`: `string` = '123' \}  \}  \}  \}[]

#### Defined in

[src/components/CheckIn/mocks.ts:48](https://github.com/chandel-aman/talawa-admin/blob/fa2649b/src/components/CheckIn/mocks.ts#L48)

___

### checkInMutationUnsuccess

• `Const` **checkInMutationUnsuccess**: \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = MARK\_CHECKIN; `variables`: \{ `allotedRoom`: `string` = ''; `allotedSeat`: `string` = ''; `eventId`: `string` = 'event123'; `userId`: `string` = 'user123' \}  \}  \}[]

#### Defined in

[src/components/CheckIn/mocks.ts:69](https://github.com/chandel-aman/talawa-admin/blob/fa2649b/src/components/CheckIn/mocks.ts#L69)

___

### checkInQueryMock

• `Const` **checkInQueryMock**: \{ `request`: \{ `query`: `DocumentNode` = EVENT\_CHECKINS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: [`InterfaceAttendeeQueryResponse`](../interfaces/components_CheckIn_types.InterfaceAttendeeQueryResponse.md) = checkInQueryData \}  \}[]

#### Defined in

[src/components/CheckIn/mocks.ts:36](https://github.com/chandel-aman/talawa-admin/blob/fa2649b/src/components/CheckIn/mocks.ts#L36)
