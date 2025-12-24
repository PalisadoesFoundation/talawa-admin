[Admin Docs](/)

***

# Variable: CURRENT\_USER

> `const` **CURRENT\_USER**: `DocumentNode`

Defined in: [src/GraphQl/Queries/Queries.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Queries/Queries.ts#L16)

Note on isInviteOnly field:
The isInviteOnly field is conditionally included in event queries using GraphQL's

## Include

directive.
By default, includeInviteOnly defaults to false, ensuring queries work with backends that don't support this field.
To enable the field, pass includeInviteOnly: true in query variables, or use the addInviteOnlyVariable helper
from utils/graphqlVariables.ts which automatically sets it based on REACT_APP_ENABLE_INVITE_ONLY environment variable.
