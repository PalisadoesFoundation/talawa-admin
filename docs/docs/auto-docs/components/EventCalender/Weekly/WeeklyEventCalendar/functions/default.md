[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/components/EventCalender/Weekly/WeeklyEventCalendar.tsx:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Weekly/WeeklyEventCalendar.tsx#L37)

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
- `.weeklyEditButton`

For more details on the reusable classes, refer to the global CSS file.

## Parameters

### props

[`InterfaceCalendarProps`](../../../../../types/Event/interface/interfaces/InterfaceCalendarProps.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`
