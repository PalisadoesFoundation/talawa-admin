[Admin Docs](/)

***

# Interface: InterfaceRecurrenceFrequencySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L44)

Props for the RecurrenceFrequencySection component.

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L46)

The selected frequency usage.

***

### localInterval

> **localInterval**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L48)

The interval value (e.g., every 2 weeks).

***

### onFrequencyChange()

> **onFrequencyChange**: (`newFrequency`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L52)

Callback when the frequency changes.

#### Parameters

##### newFrequency

[`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

#### Returns

`void`

***

### onIntervalChange()

> **onIntervalChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L50)

Callback when the interval changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`
