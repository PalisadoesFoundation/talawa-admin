[**talawa-admin**](../../../../README.md)

***

# Variable: RESEND\_VERIFICATION\_EMAIL\_MUTATION

> `const` **RESEND\_VERIFICATION\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:294](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/GraphQl/Mutations/mutations.ts#L294)

Resends the email verification link to the currently authenticated user.

## Remarks

The user must be logged in for this mutation to work.
No parameters are required as it uses the authenticated user's session.

## Returns

An object containing:
  - success: boolean indicating if the email was sent successfully
  - message: A descriptive message about the result
