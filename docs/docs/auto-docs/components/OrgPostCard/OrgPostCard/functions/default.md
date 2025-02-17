[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L43)

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
- `.modalHeader`
- `.inputField`
- `.removeButton`
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.

## Parameters

### props

[`InterfaceOrgPostCardProps`](../../../../types/Organization/interface/interfaces/InterfaceOrgPostCardProps.md)

## Returns

`JSX.Element`
