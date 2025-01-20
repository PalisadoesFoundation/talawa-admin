[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/ManageTag.tsx:64](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/ManageTag.tsx#L64)
=======
Defined in: [src/screens/ManageTag/ManageTag.tsx:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/ManageTag.tsx#L64)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

Component that renders the Manage Tag screen when the app navigates to '/orgtags/:orgId/manageTag/:tagId'.

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
- `.tableHeader`
- `.editButton`

For more details on the reusable classes, refer to the global CSS file.

## Returns

`JSX.Element`
