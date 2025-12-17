[Admin Docs](/)

***

# Interface: InterfaceOrgConnectionInfoType

Defined in: src/utils/interfaces.ts:492

InterfaceOrgConnectionInfoType

## Description

Defines the structure for organization connection information.

## Properties

### \_id

> **\_id**: `string`

Defined in: src/utils/interfaces.ts:493

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: src/utils/interfaces.ts:508

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: src/utils/interfaces.ts:504

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:507

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: src/utils/interfaces.ts:495

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

Defined in: src/utils/interfaces.ts:494

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: src/utils/interfaces.ts:501

An array of members in the organization.

#### \_id

> **\_id**: `string`

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:500

The name of the organization.
