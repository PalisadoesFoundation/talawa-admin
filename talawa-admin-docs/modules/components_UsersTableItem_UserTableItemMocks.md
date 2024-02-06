[talawa-admin](../README.md) / [Modules](../modules.md) / components/UsersTableItem/UserTableItemMocks

# Module: components/UsersTableItem/UserTableItemMocks

## Table of contents

### Variables

- [MOCKS](components_UsersTableItem_UserTableItemMocks.md#mocks)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = UPDATE\_USERTYPE\_MUTATION; `variables`: \{ `id`: `string` = '123'; `organizationId?`: `undefined` = 'abc'; `orgid?`: `undefined` = 'abc'; `role?`: `undefined` = 'ADMIN'; `userId?`: `undefined` = '123'; `userType`: `string` = 'ADMIN'; `userid?`: `undefined` = '123' \}  \} ; `result`: \{ `data`: \{ `removeMember?`: `undefined` ; `updateUserRoleInOrganization?`: `undefined` ; `updateUserType`: \{ `data`: \{ `id`: `string` = '123' \}  \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = REMOVE\_MEMBER\_MUTATION; `variables`: \{ `id?`: `undefined` = '456'; `organizationId?`: `undefined` = 'abc'; `orgid`: `string` = 'abc'; `role?`: `undefined` = 'ADMIN'; `userId?`: `undefined` = '123'; `userType?`: `undefined` = 'ADMIN'; `userid`: `string` = '123' \}  \} ; `result`: \{ `data`: \{ `removeMember`: \{ `_id`: `string` = '123' \} ; `updateUserRoleInOrganization?`: `undefined` ; `updateUserType?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = UPDATE\_USER\_ROLE\_IN\_ORG\_MUTATION; `variables`: \{ `id?`: `undefined` = '456'; `organizationId`: `string` = 'abc'; `orgid?`: `undefined` = 'abc'; `role`: `string` = 'ADMIN'; `userId`: `string` = '123'; `userType?`: `undefined` = 'ADMIN'; `userid?`: `undefined` = '123' \}  \} ; `result`: \{ `data`: \{ `removeMember?`: `undefined` ; `updateUserRoleInOrganization`: \{ `_id`: `string` = '123' \} ; `updateUserType?`: `undefined`  \}  \}  \})[]

#### Defined in

[src/components/UsersTableItem/UserTableItemMocks.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/66ecb91/src/components/UsersTableItem/UserTableItemMocks.ts#L7)
