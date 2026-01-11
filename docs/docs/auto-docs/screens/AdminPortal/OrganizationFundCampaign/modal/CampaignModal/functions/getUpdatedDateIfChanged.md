[Admin Docs](/)

***

# Function: getUpdatedDateIfChanged()

> **getUpdatedDateIfChanged**(`newDate`, `existingDate`): `string`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L76)

Returns an ISO date string when `newDate` differs from `existingDate`
(compared at second precision). Otherwise returns `undefined`.

## Parameters

### newDate

Newly selected date.

`string` | `Date`

### existingDate

Previously stored date.

`string` | `Date`

## Returns

`string`

ISO string when changed; otherwise undefined.
