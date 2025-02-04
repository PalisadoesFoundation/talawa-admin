[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/UserPortal/PromotedPost/PromotedPost.tsx:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/PromotedPost/PromotedPost.tsx#L41)

PromotedPost component displays a card representing promoted content.

This component includes:
- A header with a star icon indicating the content is promoted.
- A title and description of the promoted content.
- An optional image associated with the promoted content.

## Parameters

### props

`InterfacePostCardProps`

Properties passed to the component including an image, title, and ID.

## Returns

`JSX.Element`

JSX.Element representing a card with promoted content.

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
- `.cardHeaderPromotedPost`
- `.imageContainerPromotedPost`

For more details on the reusable classes, refer to the global CSS file.
