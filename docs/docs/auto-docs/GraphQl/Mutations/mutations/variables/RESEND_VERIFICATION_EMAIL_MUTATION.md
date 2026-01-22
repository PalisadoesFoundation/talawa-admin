[Admin Docs](/)

***

# Variable: RESEND\_VERIFICATION\_EMAIL\_MUTATION

> `const` **RESEND\_VERIFICATION\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:294](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/mutations.ts#L294)

Resends the email verification link to the currently authenticated user.

## Remarks

The user must be logged in for this mutation to work.
No parameters are required as it uses the authenticated user's session.

## Returns

An object containing:
  - success: boolean indicating if the email was sent successfully
  - message: A descriptive message about the result
