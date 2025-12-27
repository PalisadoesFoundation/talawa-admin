[**talawa-admin**](README.md)

***

# Interface: IDeleteEventModalProps

Defined in: [src/types/Event/interface.ts:123](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L123)

## Properties

### deleteEventHandler()

> **deleteEventHandler**: (`deleteOption`?) => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:129](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L129)

#### Parameters

##### deleteOption?

`"single"` | `"following"` | `"all"`

#### Returns

`Promise`\<`void`\>

***

### eventDeleteModalIsOpen

> **eventDeleteModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:125](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L125)

***

### eventListCardProps

> **eventListCardProps**: `IEventListCard`

Defined in: [src/types/Event/interface.ts:124](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L124)

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:127](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L127)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:128](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L128)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:126](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L126)

#### Returns

`void`
