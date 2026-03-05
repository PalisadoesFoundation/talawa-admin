[**talawa-admin**](../../../../README.md)

***

# Variable: RESEND\_VERIFICATION\_EMAIL\_MUTATION

> `const` **RESEND\_VERIFICATION\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:272](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/GraphQl/Mutations/mutations.ts#L272)

Resends the email verification link to the currently authenticated user.

## Remarks

The user must be logged in for this mutation to work.
No parameters are required as it uses the authenticated user's session.

## Returns

An object containing:
  - success: boolean indicating if the email was sent successfully
  - message: A descriptive message about the result
