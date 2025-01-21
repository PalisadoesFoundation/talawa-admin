[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/OrgList/OrgList.tsx:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgList/OrgList.tsx#L52)

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
- `.inputField`
- `.searchButton`

For more details on the reusable classes, refer to the global CSS file.

## Returns

`JSX.Element`
