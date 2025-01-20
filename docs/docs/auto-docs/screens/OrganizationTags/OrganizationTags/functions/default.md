[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationTags/OrganizationTags.tsx:58](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationTags/OrganizationTags.tsx#L58)
=======
Defined in: [src/screens/OrganizationTags/OrganizationTags.tsx:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTags.tsx#L58)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

Component that renders the Organization Tags screen when the app navigates to '/orgtags/:orgId'.

This component does not accept any props and is responsible for displaying
the content associated with the corresponding route.

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
- `.editButton`
- `.inputField`
- `.removeButton`

For more details on the reusable classes, refer to the global CSS file.

## Returns

`JSX.Element`
