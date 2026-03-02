[Admin Docs](/)

***

# Interface: InterfaceRecurrenceEndOptionsSectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L22)

Props for the RecurrenceEndOptionsSection component.

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L24)

The frequency of the recurrence (e.g., DAILY, WEEKLY).

***

### localCount

> **localCount**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L30)

The local count value for "End after X occurrences".

***

### onCountChange()

> **onCountChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L34)

Callback when the occurrence count changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onRecurrenceEndOptionChange()

> **onRecurrenceEndOptionChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L32)

Callback when the end option selection changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L28)

The current state of the recurrence rule being built.

***

### selectedRecurrenceEndOption

> **selectedRecurrenceEndOption**: [`RecurrenceEndOptionType`](../../../../../utils/recurrenceUtils/recurrenceTypes/type-aliases/RecurrenceEndOptionType.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L26)

The currently selected end option (NEVER, ON_DATE, AFTER_OCCURRENCES).

***

### setRecurrenceRuleState()

> **setRecurrenceRuleState**: (`state`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L36)

State setter for the recurrence rule.

#### Parameters

##### state

`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>

#### Returns

`void`
