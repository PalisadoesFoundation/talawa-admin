[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/OrganizationPeople/AddMember.tsx:80](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/OrganizationPeople/AddMember.tsx#L80)

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
