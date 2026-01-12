[Admin Docs](/)

***

# Interface: InterfaceRecurringEventProps

Defined in: [src/types/CRUDModalTemplate/interface.ts:307](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L307)

Props for recurring event pattern support

Common pattern for modals that handle recurring events

## Properties

### applyTo?

> `optional` **applyTo**: `"series"` \| `"instance"`

Defined in: [src/types/CRUDModalTemplate/interface.ts:321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L321)

Current selection: apply to entire series or single instance

***

### baseEventId?

> `optional` **baseEventId**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L316)

Base event ID for recurring series

***

### isRecurring?

> `optional` **isRecurring**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:311](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L311)

Whether the event is recurring

***

### onApplyToChange()?

> `optional` **onApplyToChange**: (`value`) => `void`

Defined in: [src/types/CRUDModalTemplate/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L326)

Callback when applyTo selection changes

#### Parameters

##### value

`"series"` | `"instance"`

#### Returns

`void`
