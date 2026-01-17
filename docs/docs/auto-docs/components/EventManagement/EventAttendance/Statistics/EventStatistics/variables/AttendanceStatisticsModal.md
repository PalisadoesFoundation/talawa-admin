[Admin Docs](/)

***

# Variable: AttendanceStatisticsModal

> `const` **AttendanceStatisticsModal**: `React.FC`\<[`InterfaceAttendanceStatisticsModalProps`](../../../../../../types/Event/interface/type-aliases/InterfaceAttendanceStatisticsModalProps.md)\>

Defined in: [src/components/EventManagement/EventAttendance/Statistics/EventStatistics.tsx:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventAttendance/Statistics/EventStatistics.tsx#L82)

Modal component for displaying attendance statistics with charts and demographics data.

## Remarks

This component displays comprehensive attendance statistics including:
- Gender distribution charts (pie/bar)
- Age distribution charts
- Historical trends across multiple events
- Demographic breakdowns by category
- CSV export functionality for data analysis

Uses Chart.js for data visualization and supports pagination through recurring events.

## Param

Controls modal visibility

## Param

Callback function to close the modal

## Param

Current event attendance statistics data

## Param

Array of member data for demographic analysis

## Returns

JSX element rendering the statistics modal
