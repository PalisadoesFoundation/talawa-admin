[Admin Docs](/)

***

# Interface: IEventFormProps

Defined in: [src/types/EventForm/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L69)

Props interface for the EventForm component.
Provides a reusable form for creating and editing events across Admin and User portals.

- `initialValues`: Initial form values
- `onSubmit`: Callback fired when form is submitted with valid data
- `onCancel`: Callback fired when form is cancelled
- `submitLabel`: Label text for the submit button
- `showCreateChat`: Whether to show the "Create Chat" toggle
- `showRegisterable`: Whether to show the "Is Registerable" toggle
- `showPublicToggle`: Whether to show the "Is Public" toggle
- `disableRecurrence`: Whether to disable recurrence options
- `submitting`: Whether the form is currently submitting
- `showRecurrenceToggle`: Whether to show the recurrence toggle
- `showCancelButton`: Whether to show the cancel button
- `readOnly`: If true, all fields are disabled (view-only/preview mode for non-editors)
- `hideSubmitButton`: If true, the built-in submit button is hidden (parent manages footer)
- `onStateChange`: Callback fired when the form state changes

## Properties

### customRecurrenceModalIsOpen?

> `optional` **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/EventForm/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L100)

Optional. When provided (e.g. from EventListCardModals), the recurrence modal is controlled by the parent.

***

### disableRecurrence?

> `optional` **disableRecurrence**: `boolean`

Defined in: [src/types/EventForm/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L78)

***

### hideCustomRecurrenceModal()?

> `optional` **hideCustomRecurrenceModal**: () => `void`

Defined in: [src/types/EventForm/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L104)

#### Returns

`void`

***

### hideSubmitButton?

> `optional` **hideSubmitButton**: `boolean`

Defined in: [src/types/EventForm/interface.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L91)

If true, the built-in submit button is hidden.
Use when the parent component manages its own footer action buttons.

***

### initialValues

> **initialValues**: [`IEventFormValues`](IEventFormValues.md)

Defined in: [src/types/EventForm/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L70)

***

### onCancel()

> **onCancel**: () => `void`

Defined in: [src/types/EventForm/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L72)

#### Returns

`void`

***

### onStateChange()?

> `optional` **onStateChange**: (`state`) => `void`

Defined in: [src/types/EventForm/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L96)

Optional callback fired whenever the internal form state changes.
Useful for syncing state to a parent component that manages complex layout or options before submit.

#### Parameters

##### state

[`IEventFormValues`](IEventFormValues.md)

#### Returns

`void`

***

### onSubmit()

> **onSubmit**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/EventForm/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L71)

#### Parameters

##### payload

[`IEventFormSubmitPayload`](IEventFormSubmitPayload.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [src/types/EventForm/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L86)

If true, all form fields are disabled (view-only mode).
Used when the PreviewModal is opened by a user who can't edit the event.

***

### setCustomRecurrenceModalIsOpen()?

> `optional` **setCustomRecurrenceModalIsOpen**: (`state`) => `void`

Defined in: [src/types/EventForm/interface.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L101)

#### Parameters

##### state

`boolean` | (`prev`) => `boolean`

#### Returns

`void`

***

### showCancelButton?

> `optional` **showCancelButton**: `boolean`

Defined in: [src/types/EventForm/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L81)

***

### showCreateChat?

> `optional` **showCreateChat**: `boolean`

Defined in: [src/types/EventForm/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L74)

***

### showPublicToggle?

> `optional` **showPublicToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L76)

***

### showRecurrenceToggle?

> `optional` **showRecurrenceToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L80)

***

### showRegisterable?

> `optional` **showRegisterable**: `boolean`

Defined in: [src/types/EventForm/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L75)

***

### submitLabel

> **submitLabel**: `string`

Defined in: [src/types/EventForm/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L73)

***

### submitting?

> `optional` **submitting**: `boolean`

Defined in: [src/types/EventForm/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L79)
