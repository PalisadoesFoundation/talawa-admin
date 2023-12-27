[talawa-admin](../README.md) / [Modules](../modules.md) / components/CheckIn/mocks

# Module: components/CheckIn/mocks

## Table of contents

### Variables

- [checkInMutationSuccess](components_CheckIn_mocks.md#checkinmutationsuccess)
- [checkInMutationUnsuccess](components_CheckIn_mocks.md#checkinmutationunsuccess)
- [checkInQueryMock](components_CheckIn_mocks.md#checkinquerymock)

## Variables

### checkInMutationSuccess

• **`checkInMutationSuccess`** (Array of objects):
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value is `MARK_CHECKIN`.
    - `variables`: Object with default properties:
      - `allotedRoom` (string): Default value `''`.
      - `allotedSeat` (string): Default value `''`.
      - `eventId` (string): Default value `'event123'`.
      - `userId` (string): Default value `'user123'`.
  - **result**: Object with properties:
    - `data`: Object containing:
      - `checkIn`: Object with properties:
        - `_id` (string): Default value `'123'`.

#### Defined in

[src/components/CheckIn/mocks.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/CheckIn/mocks.ts#L48)

___

### checkInMutationUnsuccess

• **`checkInMutationUnsuccess`** (Array of objects):
  - **error**: `Error`
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value is `MARK_CHECKIN`.
    - `variables`: Object with default properties:
      - `allotedRoom` (string): Default value `''`.
      - `allotedSeat` (string): Default value `''`.
      - `eventId` (string): Default value `'event123'`.
      - `userId` (string): Default value `'user123'`.

#### Defined in

[src/components/CheckIn/mocks.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/CheckIn/mocks.ts#L69)

___

### checkInQueryMock

• **`checkInQueryMock`** (Array of objects):
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value is `EVENT_CHECKINS`.
    - `variables`: Object with property:
      - `id` (string): Default value `'event123'`.
  - **result**: Object with properties:
    - `data`: Array of [`InterfaceAttendeeQueryResponse`](../interfaces/components_CheckIn_types.InterfaceAttendeeQueryResponse.md), default value `checkInQueryData`.


#### Defined in

[src/components/CheckIn/mocks.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/CheckIn/mocks.ts#L36)
