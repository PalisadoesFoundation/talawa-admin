[**talawa-admin**](../../../../README.md)

***

# Variable: RESEND\_VERIFICATION\_EMAIL\_MUTATION

> `const` **RESEND\_VERIFICATION\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:293](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/GraphQl/Mutations/mutations.ts#L293)

Resends the email verification link to the currently authenticated user.

## Remarks

The user must be logged in for this mutation to work.
No parameters are required as it uses the authenticated user's session.

## Returns

An object containing:
  - success: boolean indicating if the email was sent successfully
  - message: A descriptive message about the result
