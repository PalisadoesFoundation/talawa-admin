[Admin Docs](/)

***

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: [src/utils/interfaces.ts:1805](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1805)

InterfaceQueryFundCampaignsPledges

## Description

Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1811](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1811)

The currency code of the campaign.

***

### endAt

> **endAt**: `Date`

Defined in: [src/utils/interfaces.ts:1813](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1813)

The end date of the campaign.

***

### fundId

> **fundId**: `object`

Defined in: [src/utils/interfaces.ts:1806](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1806)

The fund ID object.

#### name

> **name**: `string`

***

### goalAmount

> **goalAmount**: `number`

Defined in: [src/utils/interfaces.ts:1810](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1810)

The goal amount of the campaign.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1809](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1809)

The name of the campaign.

***

### pledges

> **pledges**: `object`

Defined in: [src/utils/interfaces.ts:1814](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1814)

The pledges connection object.

#### edges

> **edges**: `object`[]

***

### startAt

> **startAt**: `Date`

Defined in: [src/utils/interfaces.ts:1812](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1812)

The start date of the campaign.
