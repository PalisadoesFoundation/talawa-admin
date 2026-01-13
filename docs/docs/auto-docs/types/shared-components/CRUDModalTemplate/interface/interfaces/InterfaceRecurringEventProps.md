[Admin Docs](/)

***

# Interface: InterfaceRecurringEventProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:301](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L301)

Props for recurring event pattern support

Common pattern for modals that handle recurring events

## Properties

### applyTo?

> `optional` **applyTo**: `"series"` \| `"instance"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:315](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L315)

Current selection: apply to entire series or single instance

***

### baseEventId?

> `optional` **baseEventId**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:310](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L310)

Base event ID for recurring series

***

### isRecurring?

> `optional` **isRecurring**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:305](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L305)

Whether the event is recurring

***

### onApplyToChange()?

> `optional` **onApplyToChange**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L320)

Callback when applyTo selection changes

#### Parameters

##### value

`"series"` | `"instance"`

#### Returns

`void`
