[talawa-admin](../README.md) / [Modules](../modules.md) / screens/OrgList/OrgListMocks

# Module: screens/OrgList/OrgListMocks

## Table of contents

### Variables

- [MOCKS](screens_OrgList_OrgListMocks.md#mocks)
- [MOCKS\_ADMIN](screens_OrgList_OrgListMocks.md#mocks_admin)
- [MOCKS\_EMPTY](screens_OrgList_OrgListMocks.md#mocks_empty)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `id`: `string` = '123' \}  \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \}  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/OrgList/OrgListMocks.ts#L79)

___

### MOCKS\_ADMIN

• `Const` **MOCKS\_ADMIN**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `id`: `string` = '123' \}  \} ; `result`: \{ `data`: `InterfaceUserType` = adminUser \}  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/OrgList/OrgListMocks.ts#L123)

___

### MOCKS\_EMPTY

• `Const` **MOCKS\_EMPTY**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `never`[] = [] \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `id`: `string` = '123' \}  \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \}  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/OrgList/OrgListMocks.ts#L100)
