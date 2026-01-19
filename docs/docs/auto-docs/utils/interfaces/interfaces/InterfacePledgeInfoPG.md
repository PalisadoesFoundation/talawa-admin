[Admin Docs](/)

***

# Interface: InterfacePledgeInfoPG

Defined in: [src/utils/interfaces.ts:1924](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1924)

InterfacePledgeInfoPG

## Description

Defines the structure for pledge information with PostgreSQL-specific fields.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1933](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1933)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1926](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1926)

The campaign associated with the pledge (optional).

#### currencyCode

> **currencyCode**: `string`

#### endDate

> **endDate**: `Date`

#### goalAmount

> **goalAmount**: `number`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1935](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1935)

The date the pledge was created.

***

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1934](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1934)

The currency code of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1925](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1925)

The unique identifier of the pledge.

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1937](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1937)

The pledger information.

***

### updatedAt?

> `optional` **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1936](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1936)

The date the pledge was last updated.
