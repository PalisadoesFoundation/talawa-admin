[Admin Docs](/)

***

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: [src/utils/interfaces.ts:1705](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1705)

InterfaceQueryFundCampaignsPledges

## Description

Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1711](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1711)

The currency code of the campaign.

***

### endAt

> **endAt**: `Date`

Defined in: [src/utils/interfaces.ts:1713](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1713)

The end date of the campaign.

***

### fundId

> **fundId**: `object`

Defined in: [src/utils/interfaces.ts:1706](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1706)

The fund ID object.

#### name

> **name**: `string`

***

### goalAmount

> **goalAmount**: `number`

Defined in: [src/utils/interfaces.ts:1710](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1710)

The goal amount of the campaign.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1709](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1709)

The name of the campaign.

***

### pledges

> **pledges**: `object`

Defined in: [src/utils/interfaces.ts:1714](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1714)

The pledges connection object.

#### edges

> **edges**: `object`[]

***

### startAt

> **startAt**: `Date`

Defined in: [src/utils/interfaces.ts:1712](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1712)

The start date of the campaign.
