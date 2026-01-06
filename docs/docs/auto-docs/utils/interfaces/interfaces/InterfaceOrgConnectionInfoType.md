[Admin Docs](/)

***

# Interface: InterfaceOrgConnectionInfoType

Defined in: [src/utils/interfaces.ts:476](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L476)

Defines the structure for organization connection information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:477](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L477)

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:492](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L492)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:488](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L488)

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:491](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L491)

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:479](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L479)

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

Defined in: [src/utils/interfaces.ts:478](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L478)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:485](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L485)

An array of members in the organization.

#### \_id

> **\_id**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:484](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L484)

The name of the organization.
