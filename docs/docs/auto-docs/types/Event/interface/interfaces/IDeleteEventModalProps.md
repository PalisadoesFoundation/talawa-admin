[Admin Docs](/)

***

# Interface: IDeleteEventModalProps

Defined in: [src/types/Event/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L128)

## Properties

### deleteEventHandler()

> **deleteEventHandler**: (`deleteOption?`) => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L134)

#### Parameters

##### deleteOption?

`"single"` | `"following"` | `"all"`

#### Returns

`Promise`\<`void`\>

***

### eventDeleteModalIsOpen

> **eventDeleteModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L130)

***

### eventListCardProps

> **eventListCardProps**: `IEventListCard`

Defined in: [src/types/Event/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L129)

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L132)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L133)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L131)

#### Returns

`void`
