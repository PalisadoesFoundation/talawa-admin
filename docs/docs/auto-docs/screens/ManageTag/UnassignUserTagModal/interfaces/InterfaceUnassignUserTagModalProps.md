[Admin Docs](/) • **Docs**

***

# Interface: InterfaceUnassignUserTagModalProps

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

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/screens/ManageTag/UnassignUserTagModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L31)

***

### t

> **t**: `TFunction`\<`"translation"`, `"manageTag"` \| `"memberDetail"`\>

#### Defined in

[src/screens/ManageTag/UnassignUserTagModal.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L32)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

#### Defined in

[src/screens/ManageTag/UnassignUserTagModal.tsx:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L33)

***

### toggleUnassignUserTagModal()

> **toggleUnassignUserTagModal**: () => `void`

#### Returns

`void`

#### Defined in

[src/screens/ManageTag/UnassignUserTagModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L30)

***

### unassignUserTagModalIsOpen

> **unassignUserTagModalIsOpen**: `boolean`

#### Defined in

[src/screens/ManageTag/UnassignUserTagModal.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/UnassignUserTagModal.tsx#L29)
