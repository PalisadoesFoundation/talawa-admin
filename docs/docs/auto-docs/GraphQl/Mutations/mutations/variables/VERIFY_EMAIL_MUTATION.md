[**talawa-admin**](../../../../README.md)

***

# Variable: VERIFY\_EMAIL\_MUTATION

> `const` **VERIFY\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:252](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/GraphQl/Mutations/mutations.ts#L252)

Verifies a user's email address using a token sent via email.

## Param

The verification token received via email

## Returns

An object containing:
  - success: boolean indicating if the verification succeeded
  - message: A descriptive message about the result
