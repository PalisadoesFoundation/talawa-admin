[Admin Docs](/)

***

# Variable: CREATE\_EVENT\_MUTATION

> `const` **CREATE\_EVENT\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/EventMutations.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/EventMutations.ts#L13)

Note on isInviteOnly field:
The isInviteOnly field is conditionally included in mutation response selections using GraphQL's

## Include

directive.
By default, includeInviteOnly defaults to false, ensuring mutations work with backends that don't support this field.
To enable the field, pass includeInviteOnly: true in mutation variables, or use the addInviteOnlyVariable helper
from utils/graphqlVariables.ts which automatically sets it based on REACT_APP_ENABLE_INVITE_ONLY environment variable.
