[Admin Docs](/)

***

# Function: default()

> **default**(`deleteVenue`, `venueRefetch?`): `object`

Defined in: [src/hooks/useVenueDeletion.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/useVenueDeletion.ts#L6)

## Parameters

### deleteVenue

`MutationFunction`\<`unknown`, `OperationVariables`\>

### venueRefetch?

() => `Promise`\<`unknown`\>

## Returns

`object`

### close()

> **close**: () => `void`

#### Returns

`void`

### confirmDelete()

> **confirmDelete**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### deleting

> **deleting**: `boolean`

### isOpen

> **isOpen**: `boolean`

### open()

> **open**: (`id`) => `void`

#### Parameters

##### id

`string`

#### Returns

`void`

### selectedVenueId

> **selectedVenueId**: `string`
