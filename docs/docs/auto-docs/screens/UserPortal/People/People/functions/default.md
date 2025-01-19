[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/UserPortal/People/People.tsx:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/People/People.tsx#L61)

`People` component displays a list of people associated with an organization.
It allows users to filter between all members and admins, search for members by their first name,
and paginate through the list.

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
- `.dropdown`

For more details on the reusable classes, refer to the global CSS file.

## Returns

`JSX.Element`
