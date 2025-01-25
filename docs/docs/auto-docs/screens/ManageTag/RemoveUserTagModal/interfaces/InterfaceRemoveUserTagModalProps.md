[Admin Docs](/) • **Docs**

***

# Interface: InterfaceRemoveUserTagModalProps

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

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/screens/ManageTag/RemoveUserTagModal.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L32)

***

### removeUserTagModalIsOpen

> **removeUserTagModalIsOpen**: `boolean`

#### Defined in

[src/screens/ManageTag/RemoveUserTagModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L30)

***

### t

> **t**: `TFunction`\<`"translation"`, `"manageTag"`\>

#### Defined in

[src/screens/ManageTag/RemoveUserTagModal.tsx:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L33)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

#### Defined in

[src/screens/ManageTag/RemoveUserTagModal.tsx:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L34)

***

### toggleRemoveUserTagModal()

> **toggleRemoveUserTagModal**: () => `void`

#### Returns

`void`

#### Defined in

[src/screens/ManageTag/RemoveUserTagModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L31)
