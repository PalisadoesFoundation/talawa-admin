[Admin Docs](/)

***

# Interface: InterfacePostFormNew

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

## Properties

### pinned

> **pinned**: `boolean`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L48)

***

### postinfo

> **postinfo**: `string`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L45)

***

### postphoto

> **postphoto**: `string`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L46)

***

### postphotoMimeType?

> `optional` **postphotoMimeType**: `string`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L49)

***

### posttitle

> **posttitle**: `string`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L44)

***

### postvideo

> **postvideo**: `string`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L47)

***

### postvideoMimeType?

> `optional` **postvideoMimeType**: `string`

Defined in: [src/components/OrgPostCard/OrgPostCard.tsx:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgPostCard/OrgPostCard.tsx#L50)
