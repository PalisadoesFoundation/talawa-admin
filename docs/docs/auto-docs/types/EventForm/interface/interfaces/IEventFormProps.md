[Admin Docs](/)

***

# Interface: IEventFormProps

Defined in: [src/types/EventForm/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L28)

## Properties

### disableRecurrence?

> `optional` **disableRecurrence**: `boolean`

Defined in: [src/types/EventForm/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L38)

***

### initialValues

> **initialValues**: [`IEventFormValues`](IEventFormValues.md)

Defined in: [src/types/EventForm/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L29)

***

### onCancel()

> **onCancel**: () => `void`

Defined in: [src/types/EventForm/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L31)

#### Returns

`void`

***

### onSubmit()

> **onSubmit**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/EventForm/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L30)

#### Parameters

##### payload

[`IEventFormSubmitPayload`](IEventFormSubmitPayload.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### showCancelButton?

> `optional` **showCancelButton**: `boolean`

Defined in: [src/types/EventForm/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L41)

***

### showCreateChat?

> `optional` **showCreateChat**: `boolean`

Defined in: [src/types/EventForm/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L35)

***

### showPublicToggle?

> `optional` **showPublicToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L37)

***

### showRecurrenceToggle?

> `optional` **showRecurrenceToggle**: `boolean`

Defined in: [src/types/EventForm/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L40)

***

### showRegisterable?

> `optional` **showRegisterable**: `boolean`

Defined in: [src/types/EventForm/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L36)

***

### submitLabel

> **submitLabel**: `string`

Defined in: [src/types/EventForm/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L32)

***

### submitting?

> `optional` **submitting**: `boolean`

Defined in: [src/types/EventForm/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L39)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/EventForm/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L33)

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

Defined in: [src/types/EventForm/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L34)

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`
