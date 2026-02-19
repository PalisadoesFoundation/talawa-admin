[Admin Docs](/)

***

# Interface: InterfaceRecurrenceFrequencySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L35)

Props for the RecurrenceFrequencySection component.

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L37)

The selected frequency usage.

***

### localInterval

> **localInterval**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L39)

The interval value (e.g., every 2 weeks).

***

### onFrequencyChange()

> **onFrequencyChange**: (`newFrequency`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L43)

Callback when the frequency changes.

#### Parameters

##### newFrequency

[`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

#### Returns

`void`

***

### onIntervalChange()

> **onIntervalChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L41)

Callback when the interval changes.

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L45)

Translation function.

#### Parameters

##### key

`string`

#### Returns

`string`
