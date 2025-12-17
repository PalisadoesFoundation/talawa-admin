[Admin Docs](/)

***

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: src/utils/interfaces.ts:1708

InterfaceQueryFundCampaignsPledges

## Description

Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: src/utils/interfaces.ts:1714

The currency code of the campaign.

***

### endAt

> **endAt**: `Date`

Defined in: src/utils/interfaces.ts:1716

The end date of the campaign.

***

### fundId

> **fundId**: `object`

Defined in: src/utils/interfaces.ts:1709

The fund ID object.

#### name

> **name**: `string`

***

### goalAmount

> **goalAmount**: `number`

Defined in: src/utils/interfaces.ts:1713

The goal amount of the campaign.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:1712

The name of the campaign.

***

### pledges

> **pledges**: `object`

Defined in: src/utils/interfaces.ts:1717

The pledges connection object.

#### edges

> **edges**: `object`[]

***

### startAt

> **startAt**: `Date`

Defined in: src/utils/interfaces.ts:1715

The start date of the campaign.
