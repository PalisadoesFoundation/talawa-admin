[Admin Docs](/)

***

# Interface: InterfaceFundInfo

Defined in: [src/utils/interfaces.ts:1816](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1816)

InterfaceFundInfo
Defines the structure for fund information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1823](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1823)

The creation date of the fund record.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1825](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1825)

The creator of the fund.

#### name

> **name**: `string`

***

### edges

> **edges**: `object`

Defined in: [src/utils/interfaces.ts:1830](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1830)

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

Defined in: [src/utils/interfaces.ts:1817](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1817)

The unique identifier of the fund.

***

### isArchived

> **isArchived**: `boolean`

Defined in: [src/utils/interfaces.ts:1821](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1821)

Indicates if the fund is archived.

***

### isDefault

> **isDefault**: `boolean`

Defined in: [src/utils/interfaces.ts:1822](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1822)

Indicates if the fund is the default fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1820](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1820)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1818](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1818)

The name of the fund.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1826](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1826)

The organization associated with the fund.

#### name

> **name**: `string`

***

### organizationId

> **organizationId**: `string`

Defined in: [src/utils/interfaces.ts:1824](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1824)

The unique identifier of the associated organization.

***

### refrenceNumber

> **refrenceNumber**: `string`

Defined in: [src/utils/interfaces.ts:1819](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1819)

The reference number of the fund.

***

### updater

> **updater**: `object`

Defined in: [src/utils/interfaces.ts:1827](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1827)

The updater of the fund.

#### name

> **name**: `string`
