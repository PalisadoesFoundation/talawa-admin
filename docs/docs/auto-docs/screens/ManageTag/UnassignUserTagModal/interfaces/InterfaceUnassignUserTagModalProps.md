[Admin Docs](/)

***

# Interface: InterfaceUnassignUserTagModalProps

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:28](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/UnassignUserTagModal.tsx#L28)
=======
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L28)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:31](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/UnassignUserTagModal.tsx#L31)
=======
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L31)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`Promise`\<`void`\>

***

### t

> **t**: `TFunction`\<`"manageTag"` \| `"memberDetail"`\>

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:32](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/UnassignUserTagModal.tsx#L32)
=======
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L32)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:33](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/UnassignUserTagModal.tsx#L33)
=======
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L33)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### toggleUnassignUserTagModal()

> **toggleUnassignUserTagModal**: () => `void`

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:30](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/UnassignUserTagModal.tsx#L30)
=======
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L30)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`void`

***

### unassignUserTagModalIsOpen

> **unassignUserTagModalIsOpen**: `boolean`

<<<<<<< HEAD
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:29](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/ManageTag/UnassignUserTagModal.tsx#L29)
=======
Defined in: [src/screens/ManageTag/UnassignUserTagModal.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L29)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84
