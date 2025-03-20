[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceAddPeopleToTagProps`](../../../../types/Tag/interface/interfaces/InterfaceAddPeopleToTagProps.md)\>

Defined in: [src/components/AddPeopleToTag/AddPeopleToTag.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTag.tsx#L49)

TSDOC

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
