[Admin Docs](/)

***

# Function: processPledgesData()

> **processPledgesData**(`pledgeData`, `searchTerm`, `sortBy`, `tCommon`): `object`

Defined in: [src/screens/FundCampaignPledge/FundCampaignPledge.utils.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/FundCampaignPledge/FundCampaignPledge.utils.ts#L26)

## Parameters

### pledgeData

#### fundCampaign

[`InterfaceQueryFundCampaignsPledges`](../../../../utils/interfaces/interfaces/InterfaceQueryFundCampaignsPledges.md)

### searchTerm

`string`

### sortBy

`"amount_ASC"` | `"amount_DESC"` | `"endDate_ASC"` | `"endDate_DESC"`

### tCommon

(`key`) => `string`

## Returns

`object`

### fundName

> **fundName**: `string`

### pledges

> **pledges**: `object`[] = `sortedPledges`

### totalPledged

> **totalPledged**: `number`
