[Admin Docs](/)

***

# Interface: InterfaceRemoveUserTagModalProps

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:29](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/RemoveUserTagModal.tsx#L29)
=======
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L29)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:32](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/RemoveUserTagModal.tsx#L32)
=======
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L32)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`Promise`\<`void`\>

***

### removeUserTagModalIsOpen

> **removeUserTagModalIsOpen**: `boolean`

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:30](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/RemoveUserTagModal.tsx#L30)
=======
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L30)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### t

> **t**: `TFunction`\<`"manageTag"`\>

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:33](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/RemoveUserTagModal.tsx#L33)
=======
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L33)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:34](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/RemoveUserTagModal.tsx#L34)
=======
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L34)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### toggleRemoveUserTagModal()

> **toggleRemoveUserTagModal**: () => `void`

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:31](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/RemoveUserTagModal.tsx#L31)
=======
Defined in: [src/screens/ManageTag/RemoveUserTagModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/RemoveUserTagModal.tsx#L31)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`void`
