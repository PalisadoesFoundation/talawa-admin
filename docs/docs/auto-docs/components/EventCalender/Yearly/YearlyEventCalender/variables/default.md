[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceCalendarProps`](../../../../../types/Event/interface/interfaces/InterfaceCalendarProps.md)\>

Defined in: [src/components/EventCalender/Yearly/YearlyEventCalender.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Yearly/YearlyEventCalender.tsx#L29)

Calendar component to display events for a selected year.

This component renders a yearly calendar with navigation to view previous and next years.
It displays events for each day, with functionality to expand and view details of events.

## Param

Array of event data to display on the calendar.

## Param

Function to refresh the event data.

## Param

Organization data to filter events.

## Param

Role of the user for access control.

## Param

ID of the user for filtering events they are attending.

## Param

Type of view for the calendar.

## Returns

JSX.Element - The rendered calendar component.
