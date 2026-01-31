[Admin Docs](/)

***

# Function: validateRecurrenceInput()

> **validateRecurrenceInput**(`recurrence`, `startDate`): `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L20)

Validates recurrence input data

## Parameters

### recurrence

[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to validate

### startDate

`Date`

The event start date

## Returns

`object`

Validation result with errors

### errors

> **errors**: `string`[]

### isValid

> **isValid**: `boolean`
