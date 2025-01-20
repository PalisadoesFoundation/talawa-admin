[Admin Docs](/)

***

# Interface: InterfaceTagActionsProps

<<<<<<< HEAD
Defined in: [src/components/TagActions/TagActions.tsx:56](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/TagActions/TagActions.tsx#L56)
=======
Defined in: [src/components/TagActions/TagActions.tsx:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActions.tsx#L56)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

Props for the `AssignToTags` component.

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

### hideTagActionsModal()

> **hideTagActionsModal**: () => `void`

<<<<<<< HEAD
Defined in: [src/components/TagActions/TagActions.tsx:58](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/TagActions/TagActions.tsx#L58)
=======
Defined in: [src/components/TagActions/TagActions.tsx:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActions.tsx#L58)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

#### Returns

`void`

***

### t

> **t**: `TFunction`\<`"manageTag"`\>

<<<<<<< HEAD
Defined in: [src/components/TagActions/TagActions.tsx:60](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/TagActions/TagActions.tsx#L60)
=======
Defined in: [src/components/TagActions/TagActions.tsx:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActions.tsx#L60)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### tagActionsModalIsOpen

> **tagActionsModalIsOpen**: `boolean`

<<<<<<< HEAD
Defined in: [src/components/TagActions/TagActions.tsx:57](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/TagActions/TagActions.tsx#L57)
=======
Defined in: [src/components/TagActions/TagActions.tsx:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActions.tsx#L57)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### tagActionType

> **tagActionType**: [`TagActionType`](../../../../utils/organizationTagsUtils/type-aliases/TagActionType.md)

<<<<<<< HEAD
Defined in: [src/components/TagActions/TagActions.tsx:59](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/TagActions/TagActions.tsx#L59)
=======
Defined in: [src/components/TagActions/TagActions.tsx:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActions.tsx#L59)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

<<<<<<< HEAD
Defined in: [src/components/TagActions/TagActions.tsx:61](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/TagActions/TagActions.tsx#L61)
=======
Defined in: [src/components/TagActions/TagActions.tsx:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActions.tsx#L61)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84
