[Admin Docs](/)

***

# Interface: InterfaceOrgConnectionInfoType

Defined in: [src/utils/interfaces.ts:576](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L576)

InterfaceOrgConnectionInfoType

## Description

Defines the structure for organization connection information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:577](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L577)

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:592](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L592)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:588](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L588)

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:591](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L591)

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:579](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L579)

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

Defined in: [src/utils/interfaces.ts:578](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L578)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:585](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L585)

An array of members in the organization.

#### \_id

> **\_id**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:584](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L584)

The name of the organization.
