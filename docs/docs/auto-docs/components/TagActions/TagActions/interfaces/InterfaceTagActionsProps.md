[Admin Docs](/)

***

# Interface: InterfaceTagActionsProps

Defined in: [src/components/TagActions/TagActions.tsx:56](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/TagActions/TagActions.tsx#L56)

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

Defined in: [src/components/TagActions/TagActions.tsx:58](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/TagActions/TagActions.tsx#L58)

#### Returns

`void`

***

### t

> **t**: `TFunction`\<`"manageTag"`\>

Defined in: [src/components/TagActions/TagActions.tsx:60](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/TagActions/TagActions.tsx#L60)

***

### tagActionsModalIsOpen

> **tagActionsModalIsOpen**: `boolean`

Defined in: [src/components/TagActions/TagActions.tsx:57](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/TagActions/TagActions.tsx#L57)

***

### tagActionType

> **tagActionType**: [`TagActionType`](../../../../utils/organizationTagsUtils/type-aliases/TagActionType.md)

Defined in: [src/components/TagActions/TagActions.tsx:59](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/TagActions/TagActions.tsx#L59)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

Defined in: [src/components/TagActions/TagActions.tsx:61](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/TagActions/TagActions.tsx#L61)
