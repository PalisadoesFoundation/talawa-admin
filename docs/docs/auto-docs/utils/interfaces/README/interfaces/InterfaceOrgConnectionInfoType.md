[**talawa-admin**](README.md)

***

# Interface: InterfaceOrgConnectionInfoType

Defined in: [src/utils/interfaces.ts:492](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L492)

InterfaceOrgConnectionInfoType

## Description

Defines the structure for organization connection information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:493](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L493)

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`](utils\interfaces\README\interfaces\InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:508](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L508)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:504](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L504)

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:507](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L507)

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:495](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L495)

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

Defined in: [src/utils/interfaces.ts:494](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L494)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:501](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L501)

An array of members in the organization.

#### \_id

> **\_id**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:500](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/interfaces.ts#L500)

The name of the organization.
