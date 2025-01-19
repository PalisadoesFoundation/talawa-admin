[Admin Docs](/)

***

# Interface: InterfaceUnassignUserTagModalProps

Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:28](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/UnassignUserTagModal.tsx#L28)

Unassign UserTag Modal component for the Manage Tag screen.

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
- `.removeButton`
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.

## Properties

### handleUnassignUserTag()

> **handleUnassignUserTag**: () => `Promise`\<`void`\>

Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:31](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/UnassignUserTagModal.tsx#L31)

#### Returns

`Promise`\<`void`\>

***

### t

> **t**: `TFunction`\<`"manageTag"` \| `"memberDetail"`\>

Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:32](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/UnassignUserTagModal.tsx#L32)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:33](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/UnassignUserTagModal.tsx#L33)

***

### toggleUnassignUserTagModal()

> **toggleUnassignUserTagModal**: () => `void`

Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:30](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/UnassignUserTagModal.tsx#L30)

#### Returns

`void`

***

### unassignUserTagModalIsOpen

> **unassignUserTagModalIsOpen**: `boolean`

Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:29](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/UnassignUserTagModal.tsx#L29)
