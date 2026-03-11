[Admin Docs](/)

***

# Interface: IDeleteEventModalProps

Defined in: [src/types/Event/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L142)

## Properties

### deleteEventHandler()

> **deleteEventHandler**: (`deleteOption?`) => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L146)

#### Parameters

##### deleteOption?

`"all"` | `"single"` | `"following"`

#### Returns

`Promise`\<`void`\>

***

### eventDeleteModalIsOpen

> **eventDeleteModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L144)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L143)

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L145)

#### Returns

`void`
