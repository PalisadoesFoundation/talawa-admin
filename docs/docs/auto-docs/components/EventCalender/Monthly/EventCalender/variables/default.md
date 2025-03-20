[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceCalendarProps`](../../../../../types/Event/interface/interfaces/InterfaceCalendarProps.md)\>

Defined in: [src/components/EventCalender/Monthly/EventCalender.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Monthly/EventCalender.tsx#L38)

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

For more details on the reusable classes, refer to the global CSS file.
