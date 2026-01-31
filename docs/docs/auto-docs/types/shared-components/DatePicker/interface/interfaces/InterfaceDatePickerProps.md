[Admin Docs](/)

***

# Interface: InterfaceDatePickerProps

Defined in: [src/types/shared-components/DatePicker/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L7)

Component Props for DatePicker

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L41)

Additional CSS class name to be applied to the root element

***

### data-cy?

> `optional` **data-cy**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L45)

Test ID for Cypress testing purposes

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L43)

Test ID for testing purposes, applied to the underlying input

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/DatePicker/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L31)

Whether the date picker is disabled

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L35)

Error message to display when validation fails

***

### format?

> `optional` **format**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L51)

Format of the date displayed in the input (e.g., "MM/DD/YYYY", "YYYY-MM-DD")

***

### helpText?

> `optional` **helpText**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L39)

Additional help text displayed below the field

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L11)

Label displayed for the date picker

***

### maxDate?

> `optional` **maxDate**: `Dayjs`

Defined in: [src/types/shared-components/DatePicker/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L29)

Maximum selectable date constraint

***

### minDate?

> `optional` **minDate**: `Dayjs`

Defined in: [src/types/shared-components/DatePicker/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L27)

Minimum selectable date constraint

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L9)

Unique name identifier for the field

***

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: [src/types/shared-components/DatePicker/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L25)

Callback fired when the field is blurred (for touch tracking)

#### Returns

`void`

***

### onChange()

> **onChange**: (`date`) => `void`

Defined in: [src/types/shared-components/DatePicker/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L21)

Callback fired when the date changes.

#### Parameters

##### date

`Dayjs`

The new date value.

#### Returns

`void`

***

### required?

> `optional` **required**: `boolean`

Defined in: [src/types/shared-components/DatePicker/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L33)

Whether the field is required

***

### slotProps?

> `optional` **slotProps**: `Partial`\<`DatePickerSlotProps`\<`false`\>\>

Defined in: [src/types/shared-components/DatePicker/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L47)

Additional props passed to MUI DatePicker slots (e.g., actionBar, layout)

***

### slots?

> `optional` **slots**: `Record`\<`string`, `React.ElementType`\>

Defined in: [src/types/shared-components/DatePicker/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L49)

Custom slot component overrides (e.g., openPickerIcon, leftArrowIcon)

***

### touched?

> `optional` **touched**: `boolean`

Defined in: [src/types/shared-components/DatePicker/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L37)

Whether the field has been touched (for validation UX)

***

### value?

> `optional` **value**: `Dayjs`

Defined in: [src/types/shared-components/DatePicker/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L16)

Current date value.
Represented as a Dayjs object or null if no date is selected.
