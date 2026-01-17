[Admin Docs](/)

***

# Interface: InterfacePledgeModal

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L36)

Props for the `PledgeModal` component.

## Properties

### campaignId

> **campaignId**: `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L42)

ID of the campaign associated with the pledge.

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L40)

Handler to close the modal.

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L38)

Indicates whether the modal is open or closed.

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L50)

Determines whether the modal is in create or edit mode.

***

### pledge

> **pledge**: [`InterfacePledgeInfo`](../../../../../utils/interfaces/interfaces/InterfacePledgeInfo.md)

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L46)

Pledge data to edit; null when creating a new pledge.

***

### refetchPledge()

> **refetchPledge**: () => `void`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L48)

Trigger to refetch pledge data after updates.

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L44)

ID of the user creating or editing the pledge.
