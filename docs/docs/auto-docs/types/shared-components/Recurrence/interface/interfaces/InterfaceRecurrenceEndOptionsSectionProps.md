[Admin Docs](/)

***

# Interface: InterfaceRecurrenceEndOptionsSectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L11)

Props for the RecurrenceEndOptionsSection component.

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L13)

The frequency of the recurrence (e.g., DAILY, WEEKLY).

***

### localCount

> **localCount**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L19)

The local count value for "End after X occurrences".

***

### onCountChange()

> **onCountChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L23)

Callback when the occurrence count changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onRecurrenceEndOptionChange()

> **onRecurrenceEndOptionChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L21)

Callback when the end option selection changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L17)

The current state of the recurrence rule being built.

***

### selectedRecurrenceEndOption

> **selectedRecurrenceEndOption**: [`RecurrenceEndOptionType`](../../../../../utils/recurrenceUtils/recurrenceTypes/type-aliases/RecurrenceEndOptionType.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L15)

The currently selected end option (NEVER, ON_DATE, AFTER_OCCURRENCES).

***

### setRecurrenceRuleState()

> **setRecurrenceRuleState**: (`state`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L25)

State setter for the recurrence rule.

#### Parameters

##### state

`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L29)

Translation function.

#### Parameters

##### key

`string`

#### Returns

`string`
