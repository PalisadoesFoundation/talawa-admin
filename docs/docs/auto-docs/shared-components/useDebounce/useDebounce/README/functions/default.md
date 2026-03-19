[Admin Docs](/)

***

# Function: default()

> **default**\<`T`\>(`callback`, `delay`): `object`

Defined in: [src/shared-components/useDebounce/useDebounce.tsx:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/useDebounce/useDebounce.tsx#L21)

## Type Parameters

### T

`T` *extends* (...`args`) => `void`

## Parameters

### callback

`T`

### delay

`number`

## Returns

`object`

### cancel()

> **cancel**: () => `void`

#### Returns

`void`

### debouncedCallback()

> **debouncedCallback**: (...`args`) => `void`

#### Parameters

##### args

...`Parameters`\<`T`\>

#### Returns

`void`
