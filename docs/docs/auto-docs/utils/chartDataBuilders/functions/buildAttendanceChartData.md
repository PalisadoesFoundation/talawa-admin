[Admin Docs](/)

***

# Function: buildAttendanceChartData()

> **buildAttendanceChartData**(`eventLabels`, `attendeeCounts`, `maleCounts`, `femaleCounts`, `otherCounts`, `t`): `ChartData`\<`"line"`\>

Defined in: [src/utils/chartDataBuilders.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/chartDataBuilders.ts#L20)

Builds attendance trends chart data for line charts.

## Parameters

### eventLabels

`string`[]

Array of event labels (dates)

### attendeeCounts

`number`[]

Array of total attendee counts

### maleCounts

`number`[]

Array of male attendee counts

### femaleCounts

`number`[]

Array of female attendee counts

### otherCounts

`number`[]

Array of other/intersex attendee counts

### t

(`key`) => `string`

Translation function

## Returns

`ChartData`\<`"line"`\>

Chart data configuration for a line chart
