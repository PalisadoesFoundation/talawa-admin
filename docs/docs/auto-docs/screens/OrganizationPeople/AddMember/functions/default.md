[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationPeople/AddMember.tsx:80](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationPeople/AddMember.tsx#L80)
=======
Defined in: [src/screens/OrganizationPeople/AddMember.tsx:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/AddMember.tsx#L80)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

AddMember component is used to add new members to the organization by selecting from
the existing users or creating a new user.
It uses the following queries and mutations:
 ORGANIZATIONS_LIST,
 ORGANIZATIONS_MEMBER_CONNECTION_LIST,
 USERS_CONNECTION_LIST,
 ADD_MEMBER_MUTATION,SIGNUP_MUTATION.

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
- `.removeButton`
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.

## Returns

`JSX.Element`
