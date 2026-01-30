[Admin Docs](/)

***

# Interface: InterfaceRecurrenceEndOptionsSectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L8)

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L9)

***

### localCount

> **localCount**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L12)

***

### onCountChange()

> **onCountChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L14)

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onRecurrenceEndOptionChange()

> **onRecurrenceEndOptionChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L13)

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L11)

***

### selectedRecurrenceEndOption

> **selectedRecurrenceEndOption**: [`RecurrenceEndOptionType`](../../../../../utils/recurrenceUtils/recurrenceTypes/type-aliases/RecurrenceEndOptionType.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L10)

***

### setRecurrenceRuleState()

> **setRecurrenceRuleState**: (`state`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L15)

#### Parameters

##### state

`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L18)

#### Parameters

##### key

`string`

#### Returns

`string`
