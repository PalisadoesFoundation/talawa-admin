[Admin Docs](/)

***

# Interface: IUpdateEventModalProps

Defined in: [src/types/Event/interface.ts:196](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L196)

## Properties

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L197)

***

### recurringEventUpdateModalIsOpen

> **recurringEventUpdateModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L198)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/Event/interface.ts:200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L200)

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

Defined in: [src/types/Event/interface.ts:201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L201)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleRecurringEventUpdateModal()

> **toggleRecurringEventUpdateModal**: () => `void`

Defined in: [src/types/Event/interface.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L199)

#### Returns

`void`

***

### updateEventHandler()

> **updateEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:202](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L202)

#### Returns

`Promise`\<`void`\>
