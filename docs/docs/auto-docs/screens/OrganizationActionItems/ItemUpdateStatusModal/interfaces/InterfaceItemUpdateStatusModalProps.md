[Admin Docs](/)

***

# Interface: InterfaceItemUpdateStatusModalProps

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:31](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L31)

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
- `.removeButton`

For more details on the reusable classes, refer to the global CSS file.

## Properties

### actionItem

> **actionItem**: [`InterfaceActionItemInfo`](../../../../utils/interfaces/interfaces/InterfaceActionItemInfo.md)

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:35](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L35)

***

### actionItemsRefetch()

> **actionItemsRefetch**: () => `void`

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:34](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L34)

#### Returns

`void`

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:33](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L33)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:32](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L32)
