[Admin Docs](/)

***

# Interface: IUpdateEventModalProps

Defined in: [src/types/Event/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L164)

## Properties

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L165)

***

### recurringEventUpdateModalIsOpen

> **recurringEventUpdateModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L169)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleRecurringEventUpdateModal()

> **toggleRecurringEventUpdateModal**: () => `void`

Defined in: [src/types/Event/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L167)

#### Returns

`void`

***

### updateEventHandler()

> **updateEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L170)

#### Returns

`Promise`\<`void`\>
