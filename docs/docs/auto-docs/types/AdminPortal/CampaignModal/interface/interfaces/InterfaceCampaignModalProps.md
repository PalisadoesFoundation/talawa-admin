[Admin Docs](/)

***

# Interface: InterfaceCampaignModalProps

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L6)

Props for the CampaignModal component.

## Properties

### campaign

> **campaign**: [`InterfaceCampaignInfo`](../../../../../utils/interfaces/interfaces/InterfaceCampaignInfo.md)

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L17)

Campaign data for edit mode, null when creating a new campaign

***

### fundId

> **fundId**: `string`

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L14)

ID of the fund this campaign belongs to

***

### hide()

> **hide**: () => `void`

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L11)

Callback to close/hide the modal

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L8)

Whether the modal is currently open

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L22)

Modal mode: 'create' for new campaign, 'edit' for existing campaign

***

### refetchCampaign()

> **refetchCampaign**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/AdminPortal/CampaignModal/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CampaignModal/interface.ts#L20)

Callback to refetch campaign data after create/update

#### Returns

`void` \| `Promise`\<`void`\>
