[Admin Docs](/)

***

# Interface: InterfaceOrgConnectionInfoType

Defined in: [src/utils/interfaces.ts:518](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L518)

InterfaceOrgConnectionInfoType

## Description

Defines the structure for organization connection information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:519](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L519)

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:534](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L534)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:530](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L530)

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:533](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L533)

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:521](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L521)

The creator of the organization.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:520](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L520)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:527](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L527)

An array of members in the organization.

#### \_id

> **\_id**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:526](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L526)

The name of the organization.
