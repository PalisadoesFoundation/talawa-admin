[Admin Docs](/)

***

# Interface: InterfaceOrgConnectionInfoType

Defined in: [src/utils/interfaces.ts:482](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L482)

InterfaceOrgConnectionInfoType
Defines the structure for organization connection information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:483](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L483)

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:498](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L498)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:494](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L494)

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:497](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L497)

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:485](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L485)

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

Defined in: [src/utils/interfaces.ts:484](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L484)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:491](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L491)

An array of members in the organization.

#### \_id

> **\_id**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:490](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L490)

The name of the organization.
