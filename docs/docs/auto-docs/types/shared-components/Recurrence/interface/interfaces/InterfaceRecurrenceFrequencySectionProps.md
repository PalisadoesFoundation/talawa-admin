[Admin Docs](/)

***

# Interface: InterfaceRecurrenceFrequencySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L21)

## Properties

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L22)

***

### localInterval

> **localInterval**: `string` \| `number`

Defined in: [src/types/shared-components/Recurrence/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L23)

***

### onFrequencyChange()

> **onFrequencyChange**: (`newFrequency`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L25)

#### Parameters

##### newFrequency

[`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

#### Returns

`void`

***

### onIntervalChange()

> **onIntervalChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L24)

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L26)

#### Parameters

##### key

`string`

#### Returns

`string`
