[Admin Docs](/)

***

# Interface: InterfaceEditUserTagModalProps

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:31](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L31)

Edit UserTag Modal component for the Manage Tag screen.

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

### editUserTagModalIsOpen

> **editUserTagModalIsOpen**: `boolean`

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:32](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L32)

***

### handleEditUserTag()

> **handleEditUserTag**: (`e`) => `Promise`\<`void`\>

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:36](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L36)

#### Parameters

##### e

`FormEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>

***

### hideEditUserTagModal()

> **hideEditUserTagModal**: () => `void`

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:33](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L33)

#### Returns

`void`

***

### newTagName

> **newTagName**: `string`

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:34](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L34)

***

### setNewTagName()

> **setNewTagName**: (`state`) => `void`

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:35](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L35)

#### Parameters

##### state

`SetStateAction`\<`string`\>

#### Returns

`void`

***

### t

> **t**: `TFunction`\<`"manageTag"`\>

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:37](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L37)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

Defined in: [src/screens/ManageTag/EditUserTagModal.tsx:38](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/ManageTag/EditUserTagModal.tsx#L38)
