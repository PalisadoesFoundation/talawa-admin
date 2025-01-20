[Admin Docs](/)

***

# Interface: InterfaceCampaignModal

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:45](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L45)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L45)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:50](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L50)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L50)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### fundId

> **fundId**: `string`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:48](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L48)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L48)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### hide()

> **hide**: () => `void`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:47](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L47)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L47)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:46](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L46)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L46)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### mode

> **mode**: `"create"` \| `"edit"`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:52](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L52)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L52)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### orgId

> **orgId**: `string`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:49](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L49)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L49)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### refetchCampaign()

> **refetchCampaign**: () => `void`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:51](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L51)
=======
Defined in: [src/screens/OrganizationFundCampaign/CampaignModal.tsx:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationFundCampaign/CampaignModal.tsx#L51)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`void`
