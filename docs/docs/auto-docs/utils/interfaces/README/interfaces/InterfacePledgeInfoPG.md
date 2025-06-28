[Admin Docs](/)

***

# Interface: InterfacePledgeInfoPG

Defined in: [src/utils/interfaces.ts:1964](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1964)

InterfacePledgeInfoPG

## Description

Defines the structure for pledge information with PostgreSQL-specific fields.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1967](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1967)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1966](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1966)

The campaign associated with the pledge (optional).

#### endDate

> **endDate**: `Date`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1968](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1968)

The currency code of the pledge.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:1969](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1969)

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1965](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1965)

The unique identifier of the pledge.

***

### pledges

> **pledges**: [`InterfaceUserInfoPG`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfoPG[]

Defined in: [src/utils/interfaces.ts:1971](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1971)

An array of user information associated with the pledges.

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:1970](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1970)

The start date of the pledge.
