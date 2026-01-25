[Admin Docs](/)

***

# Interface: InterfaceTimePickerProps

Defined in: [src/types/shared-components/TimePicker/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L6)

Component Props for TimePicker

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/TimePicker/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L26)

Additional CSS class name to be applied to the root element

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/TimePicker/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L28)

Test ID for testing purposes, applied to the underlying input

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/TimePicker/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L24)

Whether the time picker is disabled

***

### disableOpenPicker?

> `optional` **disableOpenPicker**: `boolean`

Defined in: [src/types/shared-components/TimePicker/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L36)

Whether to disable the open picker button

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/TimePicker/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L8)

Label displayed for the time picker

***

### maxTime?

> `optional` **maxTime**: `Dayjs`

Defined in: [src/types/shared-components/TimePicker/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L22)

Maximum selectable time constraint

***

### minTime?

> `optional` **minTime**: `Dayjs`

Defined in: [src/types/shared-components/TimePicker/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L20)

Minimum selectable time constraint

***

### onChange()

> **onChange**: (`date`) => `void`

Defined in: [src/types/shared-components/TimePicker/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L18)

Callback fired when the time changes.

#### Parameters

##### date

`Dayjs`

The new time value.

#### Returns

`void`

***

### slotProps?

> `optional` **slotProps**: `Partial`\<`TimePickerSlotProps`\<`false`\>\>

Defined in: [src/types/shared-components/TimePicker/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L30)

Additional props passed to MUI TimePicker slots (e.g., actionBar, layout)

***

### slots?

> `optional` **slots**: `Record`\<`string`, `React.ElementType`\>

Defined in: [src/types/shared-components/TimePicker/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L32)

Custom slot component overrides (e.g., openPickerIcon, leftArrowIcon)

***

### timeSteps?

> `optional` **timeSteps**: `object`

Defined in: [src/types/shared-components/TimePicker/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L34)

Step increments for time controls (hours, minutes, seconds)

#### hours?

> `optional` **hours**: `number`

#### minutes?

> `optional` **minutes**: `number`

#### seconds?

> `optional` **seconds**: `number`

***

### value?

> `optional` **value**: `Dayjs`

Defined in: [src/types/shared-components/TimePicker/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L13)

Current time value.
Represented as a Dayjs object or null if no time is selected.
