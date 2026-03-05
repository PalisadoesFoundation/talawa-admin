[**talawa-admin**](../../../../README.md)

***

# Function: validatePasswordConfirmation()

> **validatePasswordConfirmation**(`password`, `confirmPassword`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:73](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/validators/authValidators.ts#L73)

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
