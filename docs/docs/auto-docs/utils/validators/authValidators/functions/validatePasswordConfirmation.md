[Admin Docs](/)

***

# Function: validatePasswordConfirmation()

> **validatePasswordConfirmation**(`password`, `confirmPassword`): [`InterfaceValidationResult`](../interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/validators/authValidators.ts#L96)

Validates password confirmation matches original password.

## Parameters

### password

`string`

Original password

### confirmPassword

`string`

Confirmation password

## Returns

[`InterfaceValidationResult`](../interfaces/InterfaceValidationResult.md)

Validation result with error message if passwords don't match
