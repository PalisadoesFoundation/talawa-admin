[Admin Docs](/)

***

# Interface: InterfacePledgeModal

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L29)

Props for the `PledgeModal` component.

## Properties

### campaignId

> **campaignId**: `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L35)

ID of the campaign associated with the pledge.

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L33)

Handler to close the modal.

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L31)

Indicates whether the modal is open or closed.

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L43)

Determines whether the modal is in create or edit mode.

***

### pledge

> **pledge**: [`InterfacePledgeInfo`](../../../../../utils/interfaces/interfaces/InterfacePledgeInfo.md)

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L39)

Pledge data to edit; null when creating a new pledge.

***

### refetchPledge()

> **refetchPledge**: () => `void`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L41)

Trigger to refetch pledge data after updates.

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L37)

ID of the user creating or editing the pledge.
