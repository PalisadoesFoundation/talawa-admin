[Admin Docs](/)

---

# Interface: InterfaceQueryFundCampaignsPledges

Defined in: [src/utils/interfaces.ts:1746](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1746)

InterfaceQueryFundCampaignsPledges

## Description

Defines the structure for a query result containing fund campaigns and their pledges.

## Properties

### currencyCode

> **currencyCode**: `string`

Defined in: [src/utils/interfaces.ts:1752](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1752)

The currency code of the campaign.

---

### endAt

> **endAt**: `Date`

Defined in: [src/utils/interfaces.ts:1754](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1754)

The end date of the campaign.

---

### fundId

> **fundId**: `object`

Defined in: [src/utils/interfaces.ts:1747](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1747)

The fund ID object.

#### name

> **name**: `string`

---

### goalAmount

> **goalAmount**: `number`

Defined in: [src/utils/interfaces.ts:1751](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1751)

The goal amount of the campaign.

---

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1750](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1750)

The name of the campaign.

---

### pledges

> **pledges**: `object`

Defined in: [src/utils/interfaces.ts:1755](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1755)

The pledges connection object.

#### edges

> **edges**: `object`[]

---

### startAt

> **startAt**: `Date`

Defined in: [src/utils/interfaces.ts:1753](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1753)

The start date of the campaign.
