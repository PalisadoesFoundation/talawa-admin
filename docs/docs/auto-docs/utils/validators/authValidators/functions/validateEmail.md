[**talawa-admin**](../../../../README.md)

***

# Function: validateEmail()

> **validateEmail**(`email`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:19](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/validators/authValidators.ts#L19)

Validates email format.
Note: Uses basic regex validation. Does not enforce RFC 5322 compliance.

## Parameters

### email

`string`

Email address to validate

## Returns

[`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Validation result with error message if invalid
