[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2595](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2595)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### /_id

> **/_id**: `string`

Defined in: [src/utils/interfaces.ts:2596](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2596)

The unique identifier of the volunteer membership.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2598](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2598)

The creation date of the volunteer membership record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2599](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2599)

The event associated with the volunteer membership.

#### /_id

> **/_id**: `string`

#### startDate

> **startDate**: `string`

#### title

> **title**: `string`

***

### group

> **group**: `object`

Defined in: [src/utils/interfaces.ts:2608](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2608)

The group associated with the membership.

#### /_id

> **/_id**: `string`

#### name

> **name**: `string`

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2597](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2597)

The status of the volunteer membership.

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2604](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2604)

The volunteer associated with the membership.

#### /_id

> **/_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfo
