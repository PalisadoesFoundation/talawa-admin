[Admin Docs](/)

***

# Interface: InterfacePledgeInfoPG

Defined in: [src/utils/interfaces.ts:1917](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1917)

InterfacePledgeInfoPG
Defines the structure for pledge information with PostgreSQL-specific fields.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1926](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1926)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1919](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1919)

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

Defined in: [src/utils/interfaces.ts:1928](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1928)

The date the pledge was created.

***

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1927](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1927)

The currency code of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1918](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1918)

The unique identifier of the pledge.

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1930](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1930)

The pledger information.

***

### updatedAt?

> `optional` **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1929](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1929)

The date the pledge was last updated.
