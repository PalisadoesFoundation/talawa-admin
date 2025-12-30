[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/FundCampaignPledge/FundCampaignPledge.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/FundCampaignPledge/FundCampaignPledge.tsx#L49)

Renders the Fund Campaign Pledges screen.

Responsibilities:
- Displays all pledges for a fund campaign
- Supports searching and sorting via AdminSearchFilterBar
- Shows pledge progress toggle (pledged vs raised amounts)
- Renders popover for extra users when multiple pledgers exist
- Handles create, edit, and delete pledge flows

Localization:
- Uses `common` and `pledges` namespaces

## Returns

`Element`

JSX.Element
