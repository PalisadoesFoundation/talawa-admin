[Admin Docs](/)

***

# Function: validateEmail()

> **validateEmail**(`email`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/validators/authValidators.ts#L19)

Validates email format.
Note: Uses basic regex validation. Does not enforce RFC 5322 compliance.

## Parameters

### email

`string`

Email address to validate

## Returns

[`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Validation result with error message if invalid
