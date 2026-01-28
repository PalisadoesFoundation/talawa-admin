[**talawa-admin**](../../../../README.md)

***

# Function: validateEmail()

> **validateEmail**(`email`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:19](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/utils/validators/authValidators.ts#L19)

Validates email format.
Note: Uses basic regex validation. Does not enforce RFC 5322 compliance.

## Parameters

### email

`string`

Email address to validate

## Returns

[`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Validation result with error message if invalid
