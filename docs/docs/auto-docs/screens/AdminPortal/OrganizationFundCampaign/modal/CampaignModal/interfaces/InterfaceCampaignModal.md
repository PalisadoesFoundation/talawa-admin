[Admin Docs](/)

***

# Interface: InterfaceCampaignModal

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L47)

Props for the CampaignModal component.

## CSS Strategy Explanation:

To ensure consistency across the application and reduce duplication, common styles
(such as button styles) have been moved to the global CSS file. Instead of using
component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
class (e.g., .addButton) is now applied.

### Benefits:
- **Reduces redundant CSS code.
- **Improves maintainability by centralizing common styles.
- **Ensures consistent styling across components.

### Global CSS Classes used:
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.

## Properties

### campaign

> **campaign**: [`InterfaceCampaignInfo`](../../../../../../utils/interfaces/interfaces/InterfaceCampaignInfo.md)

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L52)

***

### fundId

> **fundId**: `string`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L50)

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L49)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L48)

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L54)

***

### orgId

> **orgId**: `string`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L51)

***

### refetchCampaign()

> **refetchCampaign**: () => `void`

Defined in: [src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFundCampaign/modal/CampaignModal.tsx#L53)

#### Returns

`void`
