[Admin Docs](/)

***

# Interface: InterfaceCampaignModalProps

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:6

Props for the CampaignModal component.

## Properties

### campaign

> **campaign**: [`InterfaceCampaignInfo`](../../../../../utils/interfaces/interfaces/InterfaceCampaignInfo.md)

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:20

Campaign data for edit mode, null when creating a new campaign

***

### fundId

> **fundId**: `string`

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:14

ID of the fund this campaign belongs to

***

### hide()

> **hide**: () => `void`

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:11

Callback to close/hide the modal

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:8

Whether the modal is currently open

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:26

Modal mode: 'create' for new campaign, 'edit' for existing campaign

***

### orgId

> **orgId**: `string`

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:17

ID of the organization

***

### refetchCampaign()

> **refetchCampaign**: () => `void`

Defined in: src/types/AdminPortal/CampaignModal/interface.ts:23

Callback to refetch campaign data after create/update

#### Returns

`void`
