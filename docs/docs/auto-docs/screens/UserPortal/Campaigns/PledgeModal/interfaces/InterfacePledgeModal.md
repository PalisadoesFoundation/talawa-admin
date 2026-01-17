[Admin Docs](/)

***

# Interface: InterfacePledgeModal

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L30)

Props for the `PledgeModal` component.

## Properties

### campaignId

> **campaignId**: `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L36)

ID of the campaign associated with the pledge.

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L34)

Handler to close the modal.

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L32)

Indicates whether the modal is open or closed.

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L44)

Determines whether the modal is in create or edit mode.

***

### pledge

> **pledge**: [`InterfacePledgeInfo`](../../../../../utils/interfaces/interfaces/InterfacePledgeInfo.md)

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L40)

Pledge data to edit; null when creating a new pledge.

***

### refetchPledge()

> **refetchPledge**: () => `void`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L42)

Trigger to refetch pledge data after updates.

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L38)

ID of the user creating or editing the pledge.
