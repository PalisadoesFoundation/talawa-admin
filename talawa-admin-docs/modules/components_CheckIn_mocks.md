[talawa-admin](../README.md) / [Modules](../modules.md) / components/CheckIn/mocks

# Module: components/CheckIn/mocks

## Table of contents

### Variables

- [checkInMutationSuccess](components_CheckIn_mocks.md#checkinmutationsuccess)
- [checkInMutationUnsuccess](components_CheckIn_mocks.md#checkinmutationunsuccess)
- [checkInQueryMock](components_CheckIn_mocks.md#checkinquerymock)

## Variables

### checkInMutationSuccess

<<<<<<< HEAD
• `Const` **checkInMutationSuccess**: \{ `request`: \{ `query`: `DocumentNode` = MARK\_CHECKIN; `variables`: \{ `allotedRoom`: `string` = ''; `allotedSeat`: `string` = ''; `eventId`: `string` = 'event123'; `userId`: `string` = 'user123' \}  \} ; `result`: \{ `data`: \{ `checkIn`: \{ `_id`: `string` = '123' \}  \}  \}  \}[]

#### Defined in

[src/components/CheckIn/mocks.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/components/CheckIn/mocks.ts#L48)
=======
• `Const` **checkInMutationSuccess**: { `request`: { `query`: `DocumentNode` = MARK\_CHECKIN; `variables`: { `allotedRoom`: `string` = ''; `allotedSeat`: `string` = ''; `eventId`: `string` = 'event123'; `userId`: `string` = 'user123' }  } ; `result`: { `data`: { `checkIn`: { `_id`: `string` = '123' }  }  }  }[]

#### Defined in

[src/components/CheckIn/mocks.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/CheckIn/mocks.ts#L48)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

___

### checkInMutationUnsuccess

<<<<<<< HEAD
• `Const` **checkInMutationUnsuccess**: \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = MARK\_CHECKIN; `variables`: \{ `allotedRoom`: `string` = ''; `allotedSeat`: `string` = ''; `eventId`: `string` = 'event123'; `userId`: `string` = 'user123' \}  \}  \}[]

#### Defined in

[src/components/CheckIn/mocks.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/components/CheckIn/mocks.ts#L69)
=======
• `Const` **checkInMutationUnsuccess**: { `error`: `Error` ; `request`: { `query`: `DocumentNode` = MARK\_CHECKIN; `variables`: { `allotedRoom`: `string` = ''; `allotedSeat`: `string` = ''; `eventId`: `string` = 'event123'; `userId`: `string` = 'user123' }  }  }[]

#### Defined in

[src/components/CheckIn/mocks.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/CheckIn/mocks.ts#L69)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

___

### checkInQueryMock

<<<<<<< HEAD
• `Const` **checkInQueryMock**: \{ `request`: \{ `query`: `DocumentNode` = EVENT\_CHECKINS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: [`InterfaceAttendeeQueryResponse`](../interfaces/components_CheckIn_types.InterfaceAttendeeQueryResponse.md) = checkInQueryData \}  \}[]

#### Defined in

[src/components/CheckIn/mocks.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/components/CheckIn/mocks.ts#L36)
=======
• `Const` **checkInQueryMock**: { `request`: { `query`: `DocumentNode` = EVENT\_CHECKINS; `variables`: { `id`: `string` = 'event123' }  } ; `result`: { `data`: [`InterfaceAttendeeQueryResponse`](../interfaces/components_CheckIn_types.InterfaceAttendeeQueryResponse.md) = checkInQueryData }  }[]

#### Defined in

[src/components/CheckIn/mocks.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/CheckIn/mocks.ts#L36)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
