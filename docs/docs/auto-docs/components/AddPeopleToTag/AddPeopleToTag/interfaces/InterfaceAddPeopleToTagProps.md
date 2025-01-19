[Admin Docs](/)

***

# Interface: InterfaceAddPeopleToTagProps

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:49](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L49)

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

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:50](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L50)

***

### hideAddPeopleToTagModal()

> **hideAddPeopleToTagModal**: () => `void`

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:51](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L51)

#### Returns

`void`

***

### refetchAssignedMembersData()

> **refetchAssignedMembersData**: () => `void`

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:52](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L52)

#### Returns

`void`

***

### t

> **t**: `TFunction`\<`"manageTag"`\>

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:53](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L53)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`\>

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:54](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L54)
