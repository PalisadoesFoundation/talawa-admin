[Admin Docs](/)

***

# Interface: InterfaceRecurringEventProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L314)

Props for recurring event pattern support

Common pattern for modals that handle recurring events

## Properties

### applyTo?

> `optional` **applyTo**: `"series"` \| `"instance"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L328)

Current selection: apply to entire series or single instance

***

### baseEventId?

> `optional` **baseEventId**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L323)

Base event ID for recurring series

***

### isRecurring?

> `optional` **isRecurring**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L318)

Whether the event is recurring

***

### onApplyToChange()?

> `optional` **onApplyToChange**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:333](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L333)

Callback when applyTo selection changes

#### Parameters

##### value

`"series"` | `"instance"`

#### Returns

`void`
