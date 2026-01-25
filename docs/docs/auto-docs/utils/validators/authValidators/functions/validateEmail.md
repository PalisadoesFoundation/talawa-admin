[**talawa-admin**](../../../../README.md)

***

# Function: validateEmail()

> **validateEmail**(`email`): [`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Defined in: [src/utils/validators/authValidators.ts:19](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/validators/authValidators.ts#L19)

Validates email format.
Note: Uses basic regex validation. Does not enforce RFC 5322 compliance.

## Parameters

### email

`string`

Email address to validate

## Returns

[`InterfaceValidationResult`](../../../../types/Auth/ValidationInterfaces/interfaces/InterfaceValidationResult.md)

Validation result with error message if invalid
