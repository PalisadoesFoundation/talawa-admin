[**talawa-admin**](../../../README.md)

***

# Interface: InterfacePledgeInfo

Defined in: [src/utils/interfaces.ts:1882](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1882)

InterfacePledgeInfo

## Description

Defines the structure for pledge information.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1891](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1891)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1884](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1884)

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

Defined in: [src/utils/interfaces.ts:1894](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1894)

The date the pledge was created.

***

### currency

> **currency**: `string`

Defined in: [src/utils/interfaces.ts:1893](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1893)

The currency of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1883](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1883)

The unique identifier of the pledge.

***

### note?

> `optional` **note**: `string`

Defined in: [src/utils/interfaces.ts:1892](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1892)

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1899](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1899)

The primary pledger who made this pledge

***

### updatedAt?

> `optional` **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1895](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1895)

The date the pledge was last updated.

***

### users?

> `optional` **users**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:1904](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1904)

An array of user information associated with the pledge.
