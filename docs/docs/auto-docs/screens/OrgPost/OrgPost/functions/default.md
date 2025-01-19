[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/OrgPost/OrgPost.tsx:70](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrgPost/OrgPost.tsx#L70)

This function is used to display the posts of the organization. It displays the posts in a card format.
It also provides the functionality to create a new post. The user can also sort the posts based on the date of creation.
The user can also search for a post based on the title of the post.

## Returns

`JSX.Element`

JSX.Element which contains the posts of the organization.

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
- `.removeButton`
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.
