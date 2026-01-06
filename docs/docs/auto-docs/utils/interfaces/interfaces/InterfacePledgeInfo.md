[Admin Docs](/)

***

# Interface: InterfacePledgeInfo

Defined in: [src/utils/interfaces.ts:1878](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1878)

InterfacePledgeInfo
Defines the structure for pledge information.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1887](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1887)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1880](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1880)

The campaign associated with the pledge (optional).

#### currencyCode

> **currencyCode**: `string`

#### endAt

> **endAt**: `Date`

#### goalAmount

> **goalAmount**: `number`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1890](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1890)

The date the pledge was created.

***

### currency

> **currency**: `string`

Defined in: [src/utils/interfaces.ts:1889](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1889)

The currency of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1879](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1879)

The unique identifier of the pledge.

***

### note?

> `optional` **note**: `string`

Defined in: [src/utils/interfaces.ts:1888](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1888)

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1895](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1895)

The primary pledger who made this pledge

***

### updatedAt?

> `optional` **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1891](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1891)

The date the pledge was last updated.

***

### users?

> `optional` **users**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:1900](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1900)

An array of user information associated with the pledge.
