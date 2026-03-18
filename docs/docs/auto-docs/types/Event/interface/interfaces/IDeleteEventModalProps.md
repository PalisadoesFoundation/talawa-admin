[Admin Docs](/)

***

# Interface: IDeleteEventModalProps

Defined in: [src/types/Event/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L151)

## Properties

### deleteEventHandler()

> **deleteEventHandler**: (`deleteOption?`) => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L155)

#### Parameters

##### deleteOption?

`"all"` | `"single"` | `"following"`

#### Returns

`Promise`\<`void`\>

***

### eventDeleteModalIsOpen

> **eventDeleteModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L153)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L152)

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L154)

#### Returns

`void`
