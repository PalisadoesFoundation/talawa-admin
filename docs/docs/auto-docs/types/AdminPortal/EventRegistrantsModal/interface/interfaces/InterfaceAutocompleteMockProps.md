[Admin Docs](/)

***

# Interface: InterfaceAutocompleteMockProps

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L27)

Props for Autocomplete mock component used in tests.

## Properties

### inputValue?

> `optional` **inputValue**: `string`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L39)

***

### noOptionsText?

> `optional` **noOptionsText**: `string`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L40)

***

### onChange()?

> `optional` **onChange**: (`event`, `value`) => `void`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L30)

#### Parameters

##### event

`SyntheticEvent`

##### value

###### id

`string`

###### name?

`string`

#### Returns

`void`

***

### onInputChange()?

> `optional` **onInputChange**: (`event`, `value`, `reason`) => `void`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L34)

#### Parameters

##### event

`SyntheticEvent`

##### value

`string`

##### reason

`string`

#### Returns

`void`

***

### options?

> `optional` **options**: `object`[]

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L29)

#### id

> **id**: `string`

#### name?

> `optional` **name**: `string`

***

### renderInput()

> **renderInput**: (`params`) => `Element`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L28)

#### Parameters

##### params

`Record`\<`string`, `unknown`\>

#### Returns

`Element`
