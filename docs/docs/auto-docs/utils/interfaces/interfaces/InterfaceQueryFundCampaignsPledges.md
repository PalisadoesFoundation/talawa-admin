[Admin Docs](/)

***

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: [src/utils/interfaces.ts:1740](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1740)

InterfaceQueryFundCampaignsPledges
Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1746](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1746)

The currency code of the campaign.

***

### endAt

> **endAt**: `Date`

Defined in: [src/utils/interfaces.ts:1748](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1748)

The end date of the campaign.

***

### fundId

> **fundId**: `object`

Defined in: [src/utils/interfaces.ts:1741](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1741)

The fund ID object.

#### name

> **name**: `string`

***

### goalAmount

> **goalAmount**: `number`

Defined in: [src/utils/interfaces.ts:1745](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1745)

The goal amount of the campaign.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1744](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1744)

The name of the campaign.

***

### pledges

> **pledges**: `object`

Defined in: [src/utils/interfaces.ts:1749](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1749)

The pledges connection object.

#### edges

> **edges**: `object`[]

***

### startAt

> **startAt**: `Date`

Defined in: [src/utils/interfaces.ts:1747](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1747)

The start date of the campaign.
