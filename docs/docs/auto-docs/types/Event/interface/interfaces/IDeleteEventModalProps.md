[Admin Docs](/)

***

# Interface: IDeleteEventModalProps

Defined in: [src/types/Event/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L138)

## Properties

### deleteEventHandler()

> **deleteEventHandler**: (`deleteOption?`) => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L144)

#### Parameters

##### deleteOption?

`"single"` | `"following"` | `"all"`

#### Returns

`Promise`\<`void`\>

***

### eventDeleteModalIsOpen

> **eventDeleteModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L140)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L139)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/Event/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L142)

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

Defined in: [src/types/Event/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L143)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L141)

#### Returns

`void`
