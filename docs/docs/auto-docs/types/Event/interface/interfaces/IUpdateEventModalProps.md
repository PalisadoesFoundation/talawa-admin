[Admin Docs](/)

***

# Interface: IUpdateEventModalProps

Defined in: [src/types/Event/interface.ts:193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L193)

## Properties

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:194](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L194)

***

### recurringEventUpdateModalIsOpen

> **recurringEventUpdateModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L195)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/Event/interface.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L197)

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

Defined in: [src/types/Event/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L198)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleRecurringEventUpdateModal()

> **toggleRecurringEventUpdateModal**: () => `void`

Defined in: [src/types/Event/interface.ts:196](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L196)

#### Returns

`void`

***

### updateEventHandler()

> **updateEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L199)

#### Returns

`Promise`\<`void`\>
