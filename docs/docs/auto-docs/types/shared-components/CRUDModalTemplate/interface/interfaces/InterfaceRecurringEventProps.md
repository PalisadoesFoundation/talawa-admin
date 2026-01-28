[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceRecurringEventProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:282](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/CRUDModalTemplate/interface.ts#L282)

Props for recurring event pattern support

Common pattern for modals that handle recurring events

## Properties

### applyTo?

> `optional` **applyTo**: `"series"` \| `"instance"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:296](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/CRUDModalTemplate/interface.ts#L296)

Current selection: apply to entire series or single instance

***

### baseEventId?

> `optional` **baseEventId**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:291](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/CRUDModalTemplate/interface.ts#L291)

Base event ID for recurring series

***

### isRecurring?

> `optional` **isRecurring**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:286](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/CRUDModalTemplate/interface.ts#L286)

Whether the event is recurring

***

### onApplyToChange()?

> `optional` **onApplyToChange**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:301](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/CRUDModalTemplate/interface.ts#L301)

Callback when applyTo selection changes

#### Parameters

##### value

`"series"` | `"instance"`

#### Returns

`void`
