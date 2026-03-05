[Admin Docs](/)

***

# Function: validatePasswordConfirmation()

> **validatePasswordConfirmation**(`password`, `confirmPassword`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/validators/authValidators.ts#L73)

Validates password confirmation matches original password.

## Parameters

### password

`string`

Original password

### confirmPassword

`string`

Confirmation password

## Returns

[`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Validation result with error message if passwords don't match
