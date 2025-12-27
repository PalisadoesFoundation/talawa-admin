[**talawa-admin**](README.md)

***

# Interface: InterfaceCampaignModal

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:44](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L44)

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

> **campaign**: [`InterfaceCampaignInfo`](utils\interfaces\README\interfaces\InterfaceCampaignInfo.md)

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:49](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L49)

***

### fundId

> **fundId**: `string`

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:47](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L47)

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:46](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L46)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:45](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L45)

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:51](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L51)

***

### orgId

> **orgId**: `string`

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:48](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L48)

***

### refetchCampaign()

> **refetchCampaign**: () => `void`

Defined in: [src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx:50](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrganizationFundCampaign/modal/CampaignModal.tsx#L50)

#### Returns

`void`
