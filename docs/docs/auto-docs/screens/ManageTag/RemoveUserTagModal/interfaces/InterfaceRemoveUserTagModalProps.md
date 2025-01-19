[Admin Docs](/)

***

# Interface: InterfaceRemoveUserTagModalProps

Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:29](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/ManageTag/RemoveUserTagModal.tsx#L29)

Remove UserTag Modal component for the Manage Tag screen.

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

### handleRemoveUserTag()

> **handleRemoveUserTag**: () => `Promise`\<`void`\>

Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:32](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/ManageTag/RemoveUserTagModal.tsx#L32)

#### Returns

`Promise`\<`void`\>

***

### removeUserTagModalIsOpen

> **removeUserTagModalIsOpen**: `boolean`

Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:30](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/ManageTag/RemoveUserTagModal.tsx#L30)

***

### t

> **t**: `TFunction`\<`"manageTag"`\>

Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:33](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/ManageTag/RemoveUserTagModal.tsx#L33)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:34](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/ManageTag/RemoveUserTagModal.tsx#L34)

***

### toggleRemoveUserTagModal()

> **toggleRemoveUserTagModal**: () => `void`

Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:31](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/ManageTag/RemoveUserTagModal.tsx#L31)

#### Returns

`void`
