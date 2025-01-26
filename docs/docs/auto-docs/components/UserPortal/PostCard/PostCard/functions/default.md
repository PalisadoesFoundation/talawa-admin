[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/UserPortal/PostCard/PostCard.tsx:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/PostCard/PostCard.tsx#L86)

PostCard component displays an individual post, including its details, interactions, and comments.

The component allows users to:
- View the post's details in a modal.
- Edit or delete the post.
- Like or unlike the post.
- Add comments to the post.
- Like or dislike individual comments.

## Parameters

### props

[`InterfacePostCard`](../../../../../utils/interfaces/interfaces/InterfacePostCard.md)

The properties passed to the component including post details, comments, and related actions.

## Returns

`JSX.Element`

JSX.Element representing a post card with interactive features.

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
