[Admin Docs](/)

***

# Interface: InterfaceCampaignModal

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:45](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L45)

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

> **campaign**: [`InterfaceCampaignInfo`](../../../../utils/interfaces/interfaces/InterfaceCampaignInfo.md)

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:50](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L50)

***

### fundId

> **fundId**: `string`

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:48](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L48)

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:47](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L47)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:46](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L46)

***

### mode

> **mode**: `"create"` \| `"edit"`

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:52](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L52)

***

### orgId

> **orgId**: `string`

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:49](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L49)

***

### refetchCampaign()

> **refetchCampaign**: () => `void`

Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:51](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L51)

#### Returns

`void`
