[Admin Docs](/)

***

# Interface: IEventFormProps

Defined in: [src/types/EventForm/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L68)

Props interface for the EventForm component.
Provides a reusable form for creating and editing events across Admin and User portals.

- `initialValues`: Initial form values
- `onSubmit`: Callback fired when form is submitted with valid data
- `onCancel`: Callback fired when form is cancelled
- `submitLabel`: Label text for the submit button
- `t`: Translation function for event-specific keys
- `tCommon`: Translation function for common keys
- `showCreateChat`: Whether to show the "Create Chat" toggle
- `showRegisterable`: Whether to show the "Is Registerable" toggle
- `showPublicToggle`: Whether to show the "Is Public" toggle
- `disableRecurrence`: Whether to disable recurrence options
- `submitting`: Whether the form is currently submitting
- `showRecurrenceToggle`: Whether to show the recurrence toggle
- `showCancelButton`: Whether to show the cancel button

## Properties

### disableRecurrence?

> `optional` **disableRecurrence**: `boolean`

Defined in: [src/types/EventForm/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L79)

***

### initialValues

> **initialValues**: [`IEventFormValues`](IEventFormValues.md)

Defined in: [src/types/EventForm/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L69)

***

### onCancel()

> **onCancel**: () => `void`

Defined in: [src/types/EventForm/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L71)

#### Returns

`void`

***

### onSubmit()

> **onSubmit**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/EventForm/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L70)

#### Parameters

##### payload

[`IEventFormSubmitPayload`](IEventFormSubmitPayload.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### showCancelButton?

> `optional` **showCancelButton**: `boolean`

Defined in: [src/types/EventForm/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L82)

***

### showCreateChat?

> `optional` **showCreateChat**: `boolean`

Defined in: [src/types/EventForm/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L75)

***

### showPublicToggle?

> `optional` **showPublicToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L77)

***

### showRecurrenceToggle?

> `optional` **showRecurrenceToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L81)

***

### showRegisterable?

> `optional` **showRegisterable**: `boolean`

Defined in: [src/types/EventForm/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L76)

***

### submitLabel

> **submitLabel**: `string`

Defined in: [src/types/EventForm/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L72)

***

### submitting?

> `optional` **submitting**: `boolean`

Defined in: [src/types/EventForm/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L80)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/EventForm/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L73)

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`, `options?`) => `string`

Defined in: [src/types/EventForm/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L74)

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`
