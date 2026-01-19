[Admin Docs](/)

***

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: [src/utils/interfaces.ts:1749](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1749)

InterfaceQueryFundCampaignsPledges

## Description

Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1755](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1755)

The currency code of the campaign.

***

### endAt

> **endAt**: `Date`

Defined in: [src/utils/interfaces.ts:1757](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1757)

The end date of the campaign.

***

### fundId

> **fundId**: `object`

Defined in: [src/utils/interfaces.ts:1750](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1750)

The fund ID object.

#### name

> **name**: `string`

***

### goalAmount

> **goalAmount**: `number`

Defined in: [src/utils/interfaces.ts:1754](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1754)

The goal amount of the campaign.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1753](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1753)

The name of the campaign.

***

### pledges

> **pledges**: `object`

Defined in: [src/utils/interfaces.ts:1758](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1758)

The pledges connection object.

#### edges

> **edges**: `object`[]

***

### startAt

> **startAt**: `Date`

Defined in: [src/utils/interfaces.ts:1756](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1756)

The start date of the campaign.
