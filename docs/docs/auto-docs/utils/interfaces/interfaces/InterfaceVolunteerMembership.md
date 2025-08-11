[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2487](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2487)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2488](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2488)

The unique identifier of the volunteer membership.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2490](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2490)

The creation date of the volunteer membership record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2491](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2491)

The event associated with the volunteer membership.

#### \_id

> **\_id**: `string`

#### startDate

> **startDate**: `string`

#### title

> **title**: `string`

***

### group

> **group**: `object`

Defined in: [src/utils/interfaces.ts:2500](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2500)

The group associated with the membership.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2489](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2489)

The status of the volunteer membership.

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2496](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2496)

The volunteer associated with the membership.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)
