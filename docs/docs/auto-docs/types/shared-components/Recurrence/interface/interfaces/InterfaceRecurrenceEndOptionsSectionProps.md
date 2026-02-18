[Admin Docs](/)

***

# Interface: InterfaceRecurrenceEndOptionsSectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L12)

Props for the RecurrenceEndOptionsSection component.

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L14)

The frequency of the recurrence (e.g., DAILY, WEEKLY).

***

### localCount

> **localCount**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L20)

The local count value for "End after X occurrences".

***

### onCountChange()

> **onCountChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L24)

Callback when the occurrence count changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onRecurrenceEndOptionChange()

> **onRecurrenceEndOptionChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L22)

Callback when the end option selection changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L18)

The current state of the recurrence rule being built.

***

### selectedRecurrenceEndOption

> **selectedRecurrenceEndOption**: [`RecurrenceEndOptionType`](../../../../../utils/recurrenceUtils/recurrenceTypes/type-aliases/RecurrenceEndOptionType.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L16)

The currently selected end option (NEVER, ON_DATE, AFTER_OCCURRENCES).

***

### setRecurrenceRuleState()

> **setRecurrenceRuleState**: (`state`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L26)

State setter for the recurrence rule.

#### Parameters

##### state

`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L30)

Translation function.

#### Parameters

##### key

`string`

#### Returns

`string`
