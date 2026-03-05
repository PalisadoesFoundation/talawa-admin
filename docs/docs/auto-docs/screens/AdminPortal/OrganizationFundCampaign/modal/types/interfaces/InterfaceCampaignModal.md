[Admin Docs](/)

***

# Interface: InterfaceCampaignModal

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L14)

Props interface for the CampaignModal component.

- isOpen: Controls visibility of the modal
- hide: Callback function to close the modal
- fundId: ID of the fund this campaign belongs to
- orgId: ID of the organization
- campaign: Existing campaign data for editing, or null for create mode
- refetchCampaign: Callback to refresh the campaign list after changes
- mode: Determines if the modal is in 'create' or 'edit' mode

## Properties

### campaign

> **campaign**: [`InterfaceCampaignInfo`](../../../../../../utils/interfaces/interfaces/InterfaceCampaignInfo.md)

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L19)

***

### fundId

> **fundId**: `string`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L17)

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L16)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L15)

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L21)

***

### orgId

> **orgId**: `string`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L18)

***

### refetchCampaign()

> **refetchCampaign**: () => `void`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/types.ts#L20)

#### Returns

`void`
