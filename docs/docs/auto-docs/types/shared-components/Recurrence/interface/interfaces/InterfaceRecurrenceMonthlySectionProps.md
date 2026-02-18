[Admin Docs](/)

***

# Interface: InterfaceRecurrenceMonthlySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L52)

Props for the RecurrenceMonthlySection component.

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L54)

The selected frequency.

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L56)

The current state of the recurrence rule being built.

***

### setRecurrenceRuleState()

> **setRecurrenceRuleState**: (`state`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L58)

State setter for the recurrence rule.

#### Parameters

##### state

`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>

#### Returns

`void`

***

### startDate

> **startDate**: `Date`

Defined in: [src/types/shared-components/Recurrence/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L62)

The start date of the recurrence.

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L64)

Translation function.

#### Parameters

##### key

`string`

#### Returns

`string`
