[Admin Docs](/)

***

# Function: default()

> **default**(`__namedParameters`): `JSX.Element`

Defined in: [src/components/EventCalendar/EventHeader.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalendar/EventHeader.tsx#L47)

EventHeader component displays the header for the event calendar.
It includes a search field, view type dropdown, event type dropdown, and a button to create an event.

## Parameters

### \_\_namedParameters

`InterfaceEventHeaderProps`

## Returns

`JSX.Element`

JSX.Element - The rendered EventHeader component.

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
- `.dropdown`
- `.btnsContainer`
- `.btnsBlock`

For more details on the reusable classes, refer to the global CSS file.
