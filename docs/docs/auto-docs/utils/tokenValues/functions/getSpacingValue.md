[Admin Docs](/)

***

# Function: getSpacingValue()

> **getSpacingValue**(`token`): `number`

Defined in: [src/utils/tokenValues.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/tokenValues.ts#L66)

Converts a spacing token name to its pixel value.

## Parameters

### token

`string`

The spacing token name (e.g., 'space-15')

## Returns

`number`

The pixel value as a number

## Throws

Error if the token name is not found

## Example

```ts
getSpacingValue('space-15') // returns 150
getSpacingValue('space-8')  // returns 32
```
