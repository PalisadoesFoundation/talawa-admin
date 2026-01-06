[Admin Docs](/)

***

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: [src/utils/interfaces.ts:1682](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1682)

Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1688](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1688)

The currency code of the campaign.

***

### endAt

> **endAt**: `Date`

Defined in: [src/utils/interfaces.ts:1690](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1690)

The end date of the campaign.

***

### fundId

> **fundId**: `object`

Defined in: [src/utils/interfaces.ts:1683](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1683)

The fund ID object.

#### name

> **name**: `string`

***

### goalAmount

> **goalAmount**: `number`

Defined in: [src/utils/interfaces.ts:1687](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1687)

The goal amount of the campaign.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1686](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1686)

The name of the campaign.

***

### pledges

> **pledges**: `object`

Defined in: [src/utils/interfaces.ts:1691](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1691)

The pledges connection object.

#### edges

> **edges**: `object`[]

***

### startAt

> **startAt**: `Date`

Defined in: [src/utils/interfaces.ts:1689](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1689)

The start date of the campaign.
