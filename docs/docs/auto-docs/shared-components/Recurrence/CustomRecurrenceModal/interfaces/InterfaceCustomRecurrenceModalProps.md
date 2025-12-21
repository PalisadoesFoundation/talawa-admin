[Admin Docs](/)

***

# Interface: InterfaceCustomRecurrenceModalProps

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L27)

Props interface for the CustomRecurrenceModal component

## Properties

### customRecurrenceModalIsOpen

> **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L39)

Whether the custom recurrence modal is open

***

### endDate

> **endDate**: `Date`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L35)

Event end date

***

### hideCustomRecurrenceModal()

> **hideCustomRecurrenceModal**: () => `void`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L41)

Function to hide the custom recurrence modal

#### Returns

`void`

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L29)

Current recurrence rule state

***

### setCustomRecurrenceModalIsOpen()

> **setCustomRecurrenceModalIsOpen**: (`state`) => `void`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L43)

Function to set custom recurrence modal open state

#### Parameters

##### state

`SetStateAction`\<`boolean`\>

#### Returns

`void`

***

### setEndDate()

> **setEndDate**: (`state`) => `void`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L37)

Function to set event end date

#### Parameters

##### state

`SetStateAction`\<`Date`\>

#### Returns

`void`

***

### setRecurrenceRuleState()

> **setRecurrenceRuleState**: (`state`) => `void`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L31)

Function to update recurrence rule state

#### Parameters

##### state

`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>

#### Returns

`void`

***

### startDate

> **startDate**: `Date`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L49)

Event start date

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L47)

Translation function

#### Parameters

##### key

`string`

#### Returns

`string`
