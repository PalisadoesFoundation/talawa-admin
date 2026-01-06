[Admin Docs](/)

***

# Interface: InterfaceFundInfo

Defined in: [src/utils/interfaces.ts:1756](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1756)

Defines the structure for fund information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1763](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1763)

The creation date of the fund record.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1765](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1765)

The creator of the fund.

#### name

> **name**: `string`

***

### edges

> **edges**: `object`

Defined in: [src/utils/interfaces.ts:1770](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1770)

The edges connection object.

#### node

> **node**: `object`

##### node.createdAt

> **createdAt**: `string`

##### node.currency

> **currency**: `string`

##### node.endDate

> **endDate**: `string`

##### node.fundingGoal

> **fundingGoal**: `number`

##### node.id

> **id**: `string`

##### node.name

> **name**: `string`

##### node.startDate

> **startDate**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1757](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1757)

The unique identifier of the fund.

***

### isArchived

> **isArchived**: `boolean`

Defined in: [src/utils/interfaces.ts:1761](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1761)

Indicates if the fund is archived.

***

### isDefault

> **isDefault**: `boolean`

Defined in: [src/utils/interfaces.ts:1762](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1762)

Indicates if the fund is the default fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1760](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1760)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1758](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1758)

The name of the fund.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1766](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1766)

The organization associated with the fund.

#### name

> **name**: `string`

***

### organizationId

> **organizationId**: `string`

Defined in: [src/utils/interfaces.ts:1764](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1764)

The unique identifier of the associated organization.

***

### refrenceNumber

> **refrenceNumber**: `string`

Defined in: [src/utils/interfaces.ts:1759](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1759)

The reference number of the fund.

***

### updater

> **updater**: `object`

Defined in: [src/utils/interfaces.ts:1767](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1767)

The updater of the fund.

#### name

> **name**: `string`
