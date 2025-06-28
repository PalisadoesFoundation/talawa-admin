[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationListObject

Defined in: [src/utils/interfaces.ts:1463](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1463)

InterfaceQueryOrganizationListObject

## Description

Defines the structure for an organization list object returned from a query.

## Properties

### /_id

> **/_id**: `string`

Defined in: [src/utils/interfaces.ts:1464](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1464)

The unique identifier of the organization.

***

### address

> **address**: [`InterfaceAddress`]/auto-docs/utils/interfaces/README/interfaces/InterfaceAddress

Defined in: [src/utils/interfaces.ts:1478](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1478)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:1474](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1474)

An array of administrators in the organization.

#### /_id

> **/_id**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1477](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1477)

The creation date of the organization.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1466](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1466)

The creator of the organization.

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:1465](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1465)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:1471](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1471)

An array of members in the organization.

#### /_id

> **/_id**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1470](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1470)

The name of the organization.
