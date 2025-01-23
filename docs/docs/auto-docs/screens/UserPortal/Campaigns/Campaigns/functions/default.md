[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/Campaigns/Campaigns.tsx:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/Campaigns.tsx#L53)

The `Campaigns` component displays a list of fundraising campaigns for a specific organization.
It allows users to search, sort, and view details about each campaign. Users can also add pledges to active campaigns.

## Returns

`Element`

The rendered component displaying the campaigns.

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
- `.btnsContainer`
- `.input`
- `.inputField`
- `.searchButton`
- `.btnsBlock`
- `.regularBtn`
- `.outlineBtn`

For more details on the reusable classes, refer to the global CSS file.
