[Admin Docs](/) • **Docs**

***

# Interface: InterfaceAddPeopleToTagProps

Props for the `AddPeopleToTag` component.

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
- `.editButton`
- `.modalHeader`
- `.inputField`
- `.addButton`
- `.removeButton`

For more details on the reusable classes, refer to the global CSS file.

## Properties

### addPeopleToTagModalIsOpen

> **addPeopleToTagModalIsOpen**: `boolean`

#### Defined in

[src/components/AddPeopleToTag/AddPeopleToTag.tsx:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L50)

***

### hideAddPeopleToTagModal()

> **hideAddPeopleToTagModal**: () => `void`

#### Returns

`void`

#### Defined in

[src/components/AddPeopleToTag/AddPeopleToTag.tsx:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L51)

***

### refetchAssignedMembersData()

> **refetchAssignedMembersData**: () => `void`

#### Returns

`void`

#### Defined in

[src/components/AddPeopleToTag/AddPeopleToTag.tsx:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L52)

***

### t

> **t**: `TFunction`\<`"translation"`, `"manageTag"`\>

#### Defined in

[src/components/AddPeopleToTag/AddPeopleToTag.tsx:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L53)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

#### Defined in

[src/components/AddPeopleToTag/AddPeopleToTag.tsx:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L54)
