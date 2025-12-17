[Admin Docs](/)

***

# Interface: IDeleteEventModalProps

Defined in: src/types/Event/interface.ts:123

## Properties

### deleteEventHandler()

> **deleteEventHandler**: (`deleteOption?`) => `Promise`\<`void`\>

Defined in: src/types/Event/interface.ts:129

#### Parameters

##### deleteOption?

`"single"` | `"following"` | `"all"`

#### Returns

`Promise`\<`void`\>

***

### eventDeleteModalIsOpen

> **eventDeleteModalIsOpen**: `boolean`

Defined in: src/types/Event/interface.ts:125

***

### eventListCardProps

> **eventListCardProps**: `IEventListCard`

Defined in: src/types/Event/interface.ts:124

***

### t()

> **t**: (`key`) => `string`

Defined in: src/types/Event/interface.ts:127

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: src/types/Event/interface.ts:128

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: src/types/Event/interface.ts:126

#### Returns

`void`
