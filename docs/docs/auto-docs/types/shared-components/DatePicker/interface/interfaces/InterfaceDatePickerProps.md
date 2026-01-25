[Admin Docs](/)

***

# Interface: InterfaceDatePickerProps

Defined in: [src/types/shared-components/DatePicker/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L6)

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L26)

Additional CSS class name to be applied to the root element

***

### data-cy?

> `optional` **data-cy**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L30)

Test ID for Cypress testing purposes

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L28)

Test ID for testing purposes, applied to the underlying input

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/DatePicker/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L24)

Whether the date picker is disabled

***

### format?

> `optional` **format**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L36)

Format of the date displayed in the input (e.g., "MM/DD/YYYY", "YYYY-MM-DD")

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/DatePicker/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L8)

Label displayed for the date picker

***

### maxDate?

> `optional` **maxDate**: `Dayjs`

Defined in: [src/types/shared-components/DatePicker/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L22)

Maximum selectable date constraint

***

### minDate?

> `optional` **minDate**: `Dayjs`

Defined in: [src/types/shared-components/DatePicker/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L20)

Minimum selectable date constraint

***

### onChange()

> **onChange**: (`date`) => `void`

Defined in: [src/types/shared-components/DatePicker/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L18)

Callback fired when the date changes.

#### Parameters

##### date

`Dayjs`

The new date value.

#### Returns

`void`

***

### slotProps?

> `optional` **slotProps**: `Partial`\<`DatePickerSlotProps`\<`false`\>\>

Defined in: [src/types/shared-components/DatePicker/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L32)

Additional props passed to MUI DatePicker slots (e.g., actionBar, layout)

***

### slots?

> `optional` **slots**: `Record`\<`string`, `React.ElementType`\>

Defined in: [src/types/shared-components/DatePicker/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L34)

Custom slot component overrides (e.g., openPickerIcon, leftArrowIcon)

***

### value?

> `optional` **value**: `Dayjs`

Defined in: [src/types/shared-components/DatePicker/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DatePicker/interface.ts#L13)

Current date value.
Represented as a Dayjs object or null if no date is selected.
