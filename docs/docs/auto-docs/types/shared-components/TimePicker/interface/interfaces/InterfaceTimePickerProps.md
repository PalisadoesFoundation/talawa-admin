[Admin Docs](/)

***

# Interface: InterfaceTimePickerProps

Defined in: [src/types/shared-components/TimePicker/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L7)

Component Props for TimePicker

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/TimePicker/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L27)

Additional CSS class name to be applied to the root element

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/TimePicker/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L29)

Test ID for testing purposes, applied to the underlying input

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/TimePicker/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L25)

Whether the time picker is disabled

***

### disableOpenPicker?

> `optional` **disableOpenPicker**: `boolean`

Defined in: [src/types/shared-components/TimePicker/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L37)

Whether to disable the open picker button

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/TimePicker/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L9)

Label displayed for the time picker

***

### maxTime?

> `optional` **maxTime**: `Dayjs`

Defined in: [src/types/shared-components/TimePicker/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L23)

Maximum selectable time constraint

***

### minTime?

> `optional` **minTime**: `Dayjs`

Defined in: [src/types/shared-components/TimePicker/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L21)

Minimum selectable time constraint

***

### onChange()

> **onChange**: (`date`) => `void`

Defined in: [src/types/shared-components/TimePicker/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L19)

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

Defined in: [src/types/shared-components/TimePicker/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L31)

Additional props passed to MUI TimePicker slots (e.g., actionBar, layout)

***

### slots?

> `optional` **slots**: `Record`\<`string`, `React.ElementType`\>

Defined in: [src/types/shared-components/TimePicker/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L33)

Custom slot component overrides (e.g., openPickerIcon, leftArrowIcon)

***

### timeSteps?

> `optional` **timeSteps**: `object`

Defined in: [src/types/shared-components/TimePicker/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L35)

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

Defined in: [src/types/shared-components/TimePicker/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/TimePicker/interface.ts#L14)

Current time value.
Represented as a Dayjs object or null if no time is selected.
