[**talawa-admin**](../../../../README.md)

***

# Function: validateEmail()

> **validateEmail**(`email`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:19](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/utils/validators/authValidators.ts#L19)

Validates email format.
Note: Uses basic regex validation. Does not enforce RFC 5322 compliance.

## Parameters

### email

`string`

Email address to validate

## Returns

[`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Validation result with error message if invalid
