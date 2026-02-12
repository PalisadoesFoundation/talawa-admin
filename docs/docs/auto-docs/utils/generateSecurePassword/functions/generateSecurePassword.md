[**talawa-admin**](../../../README.md)

***

# Function: generateSecurePassword()

> **generateSecurePassword**(): `string`

Defined in: [src/utils/generateSecurePassword.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/6da4113439e29bce68487ecac57306eb82f6d596/src/utils/generateSecurePassword.ts#L20)

Generates a secure random password that meets the validation requirements.

The generated password will:
- Be at least 12 characters long (for better security)
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number
- Contain at least one special character

## Returns

`string`

A secure random password string.

## Example

```ts
const password = generateSecurePassword();
console.log(password); // e.g., "Xy7$kL9mN2pQ!"
```
