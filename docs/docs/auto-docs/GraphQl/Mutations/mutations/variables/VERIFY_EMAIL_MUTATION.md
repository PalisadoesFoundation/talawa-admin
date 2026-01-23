[Admin Docs](/)

***

# Variable: VERIFY\_EMAIL\_MUTATION

> `const` **VERIFY\_EMAIL\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/mutations.ts#L273)

Verifies a user's email address using a token sent via email.

## Param

The verification token received via email

## Returns

An object containing:
  - success: boolean indicating if the verification succeeded
  - message: A descriptive message about the result
