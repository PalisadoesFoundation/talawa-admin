[talawa-admin](../README.md) / [Modules](../modules.md) / screens/OrgList/OrgListMocks

# Module: screens/OrgList/OrgListMocks

## Table of contents

### Variables

- [MOCKS](screens_OrgList_OrgListMocks.md#mocks)
- [MOCKS\_ADMIN](screens_OrgList_OrgListMocks.md#mocks_admin)
- [MOCKS\_EMPTY](screens_OrgList_OrgListMocks.md#mocks_empty)
- [MOCKS\_WITH\_ERROR](screens_OrgList_OrgListMocks.md#mocks_with_error)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables`: \{ `description?`: `undefined` = 'This is a new update'; `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `image?`: `undefined` ; `location?`: `undefined` = 'New Delhi'; `name?`: `undefined` = ''; `orderBy`: `string` = 'createdAt\_ASC'; `skip`: `number` = 0; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \}  \} ; `result`: \{ `data`: \{ `createOrganization?`: `undefined` ; `createSampleOrganization?`: `undefined` ; `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \}  \}  \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `description?`: `undefined` = 'This is a new update'; `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `image?`: `undefined` ; `location?`: `undefined` = 'New Delhi'; `name?`: `undefined` = ''; `orderBy?`: `undefined` = 'createdAt\_ASC'; `skip?`: `undefined` = 0; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \}  \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \}  \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = CREATE\_SAMPLE\_ORGANIZATION\_MUTATION; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `createOrganization?`: `undefined` ; `createSampleOrganization`: \{ `id`: `string` = '1'; `name`: `string` = 'Sample Organization' \} ; `organizationsConnection?`: `undefined` = organizations \}  \}  \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = CREATE\_ORGANIZATION\_MUTATION; `variables`: \{ `description`: `string` = 'This is a dummy organization'; `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id?`: `undefined` = '456'; `image`: `string` = ''; `location`: `string` = 'Delhi, India'; `name`: `string` = 'Dummy Organization'; `orderBy?`: `undefined` = 'createdAt\_ASC'; `skip?`: `undefined` = 0; `userRegistrationRequired`: `boolean` = false; `visibleInSearch`: `boolean` = true \}  \} ; `result`: \{ `data`: \{ `createOrganization`: \{ `_id`: `string` = '1' \} ; `createSampleOrganization?`: `undefined` ; `organizationsConnection?`: `undefined` = organizations \}  \}  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:83](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/OrgList/OrgListMocks.ts#L83)

___

### MOCKS\_ADMIN

• `Const` **MOCKS\_ADMIN**: (\{ `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables`: \{ `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `orderBy`: `string` = 'createdAt\_ASC'; `skip`: `number` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \}  \}  \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `orderBy?`: `undefined` = 'createdAt\_ASC'; `skip?`: `undefined` = 0 \}  \} ; `result`: \{ `data`: `InterfaceUserType` = adminUser \}  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:208](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/OrgList/OrgListMocks.ts#L208)

___

### MOCKS\_EMPTY

• `Const` **MOCKS\_EMPTY**: (\{ `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables`: \{ `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `orderBy`: `string` = 'createdAt\_ASC'; `skip`: `number` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `never`[] = [] \}  \}  \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `orderBy?`: `undefined` = 'createdAt\_ASC'; `skip?`: `undefined` = 0 \}  \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \}  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:144](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/OrgList/OrgListMocks.ts#L144)

___

### MOCKS\_WITH\_ERROR

• `Const` **MOCKS\_WITH\_ERROR**: (\{ `error?`: `undefined` ; `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables`: \{ `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `orderBy`: `string` = 'createdAt\_ASC'; `skip`: `number` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \}  \}  \} \| \{ `error?`: `undefined` ; `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `orderBy?`: `undefined` = 'createdAt\_ASC'; `skip?`: `undefined` = 0 \}  \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \}  \} \| \{ `error`: `Error` ; `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = CREATE\_SAMPLE\_ORGANIZATION\_MUTATION; `variables?`: `undefined`  \} ; `result?`: `undefined`  \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:172](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/OrgList/OrgListMocks.ts#L172)
