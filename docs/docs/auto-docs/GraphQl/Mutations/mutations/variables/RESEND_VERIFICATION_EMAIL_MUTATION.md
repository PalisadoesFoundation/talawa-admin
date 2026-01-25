[**talawa-admin**](../../../../README.md)

***

# Variable: RESEND\_VERIFICATION\_EMAIL\_MUTATION

> `const` **RESEND\_VERIFICATION\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:293](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/GraphQl/Mutations/mutations.ts#L293)

Resends the email verification link to the currently authenticated user.

## Remarks

The user must be logged in for this mutation to work.
No parameters are required as it uses the authenticated user's session.

## Returns

An object containing:
  - success: boolean indicating if the email was sent successfully
  - message: A descriptive message about the result
