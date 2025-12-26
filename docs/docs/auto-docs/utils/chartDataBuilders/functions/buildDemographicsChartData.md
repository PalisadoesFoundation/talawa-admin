[Admin Docs](/)

***

# Function: buildDemographicsChartData()

> **buildDemographicsChartData**(`categoryLabels`, `categoryData`, `selectedCategory`, `t`): `ChartData`\<`"bar"`\>

Defined in: [src/utils/chartDataBuilders.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/chartDataBuilders.ts#L68)

Builds demographics chart data for bar charts.

## Parameters

### categoryLabels

`string`[]

Array of category labels (e.g., ['Male', 'Female', 'Other'] or age groups)

### categoryData

`number`[]

Array of counts for each category

### selectedCategory

`string`

The selected category type ('Gender' or 'Age')

### t

(`key`) => `string`

Translation function

## Returns

`ChartData`\<`"bar"`\>

Chart data configuration for a bar chart
