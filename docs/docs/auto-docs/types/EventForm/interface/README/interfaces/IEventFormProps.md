[**talawa-admin**](README.md)

***

# Interface: IEventFormProps

Defined in: [src/types/EventForm/interface.ts:58](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L58)

Props interface for the EventForm component.
Provides a reusable form for creating and editing events across Admin and User portals.

## Properties

### disableRecurrence?

> `optional` **disableRecurrence**: `boolean`

Defined in: [src/types/EventForm/interface.ts:68](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L68)

Whether to disable recurrence options

***

### initialValues

> **initialValues**: [`IEventFormValues`](types\EventForm\interface\README\interfaces\IEventFormValues.md)

Defined in: [src/types/EventForm/interface.ts:59](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L59)

Initial form values

***

### onCancel()

> **onCancel**: () => `void`

Defined in: [src/types/EventForm/interface.ts:61](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L61)

Callback fired when form is cancelled

#### Returns

`void`

***

### onSubmit()

> **onSubmit**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/EventForm/interface.ts:60](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L60)

Callback fired when form is submitted with valid data

#### Parameters

##### payload

[`IEventFormSubmitPayload`](types\EventForm\interface\README\interfaces\IEventFormSubmitPayload.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### showCancelButton?

> `optional` **showCancelButton**: `boolean`

Defined in: [src/types/EventForm/interface.ts:71](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L71)

Whether to show the cancel button

***

### showCreateChat?

> `optional` **showCreateChat**: `boolean`

Defined in: [src/types/EventForm/interface.ts:65](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L65)

Whether to show the "Create Chat" toggle

***

### showPublicToggle?

> `optional` **showPublicToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:67](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L67)

Whether to show the "Is Public" toggle

***

### showRecurrenceToggle?

> `optional` **showRecurrenceToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:70](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L70)

Whether to show the recurrence toggle

***

### showRegisterable?

> `optional` **showRegisterable**: `boolean`

Defined in: [src/types/EventForm/interface.ts:66](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L66)

Whether to show the "Is Registerable" toggle

***

### submitLabel

> **submitLabel**: `string`

Defined in: [src/types/EventForm/interface.ts:62](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L62)

Label text for the submit button

***

### submitting?

> `optional` **submitting**: `boolean`

Defined in: [src/types/EventForm/interface.ts:69](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L69)

Whether the form is currently submitting

***

### t()

> **t**: (`key`, `options`?) => `string`

Defined in: [src/types/EventForm/interface.ts:63](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L63)

Translation function for event-specific keys

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`, `options`?) => `string`

Defined in: [src/types/EventForm/interface.ts:64](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/EventForm/interface.ts#L64)

Translation function for common keys

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`
