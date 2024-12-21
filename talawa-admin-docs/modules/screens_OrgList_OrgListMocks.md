[talawa-admin](../README.md) / [Modules](../modules.md) / screens/OrgList/OrgListMocks

# Module: screens/OrgList/OrgListMocks

## Table of contents

### Variables

- [MOCKS](screens_OrgList_OrgListMocks.md#mocks)
- [MOCKS_ADMIN](screens_OrgList_OrgListMocks.md#mocks_admin)
- [MOCKS_EMPTY](screens_OrgList_OrgListMocks.md#mocks_empty)
- [MOCKS_WITH_ERROR](screens_OrgList_OrgListMocks.md#mocks_with_error)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION_CONNECTION_LIST; `variables`: \{ `address?`: `undefined` ; `description?`: `undefined` = 'This is a new update'; `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `image?`: `undefined` ; `name?`: `undefined` = ''; `orderBy`: `string` = 'createdAt_ASC'; `skip`: `number` = 0; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \} \} ; `result`: \{ `data`: \{ `createOrganization?`: `undefined` ; `createSampleOrganization?`: `undefined` ; `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \} \} \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER_ORGANIZATION_LIST; `variables`: \{ `address?`: `undefined` ; `description?`: `undefined` = 'This is a new update'; `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `image?`: `undefined` ; `name?`: `undefined` = ''; `orderBy?`: `undefined` = 'createdAt_ASC'; `skip?`: `undefined` = 0; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \} \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \} \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = CREATE_SAMPLE_ORGANIZATION_MUTATION; `variables?`: `undefined` \} ; `result`: \{ `data`: \{ `createOrganization?`: `undefined` ; `createSampleOrganization`: \{ `id`: `string` = '1'; `name`: `string` = 'Sample Organization' \} ; `organizationsConnection?`: `undefined` = organizations \} \} \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = CREATE_ORGANIZATION_MUTATION; `variables`: \{ `address`: \{ `city`: `string` = 'Kingston'; `countryCode`: `string` = 'JM'; `dependentLocality`: `string` = 'Sample Dependent Locality'; `line1`: `string` = '123 Jamaica Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = 'JM12345'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Kingston Parish' \} ; `description`: `string` = 'This is a dummy organization'; `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id?`: `undefined` = '456'; `image`: `string` = ''; `name`: `string` = 'Dummy Organization'; `orderBy?`: `undefined` = 'createdAt_ASC'; `skip?`: `undefined` = 0; `userRegistrationRequired`: `boolean` = false; `visibleInSearch`: `boolean` = true \} \} ; `result`: \{ `data`: \{ `createOrganization`: \{ `_id`: `string` = '1' \} ; `createSampleOrganization?`: `undefined` ; `organizationsConnection?`: `undefined` = organizations \} \} \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/screens/OrgList/OrgListMocks.ts#L101)

---

### MOCKS_ADMIN

• `Const` **MOCKS_ADMIN**: (\{ `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION_CONNECTION_LIST; `variables`: \{ `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `orderBy`: `string` = 'createdAt_ASC'; `skip`: `number` = 0 \} \} ; `result`: \{ `data`: \{ `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \} \} \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER_ORGANIZATION_LIST; `variables`: \{ `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `orderBy?`: `undefined` = 'createdAt_ASC'; `skip?`: `undefined` = 0 \} \} ; `result`: \{ `data`: `InterfaceUserType` = adminUser \} \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:235](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/screens/OrgList/OrgListMocks.ts#L235)

---

### MOCKS_EMPTY

• `Const` **MOCKS_EMPTY**: (\{ `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION_CONNECTION_LIST; `variables`: \{ `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `orderBy`: `string` = 'createdAt_ASC'; `skip`: `number` = 0 \} \} ; `result`: \{ `data`: \{ `organizationsConnection`: `never`[] = [] \} \} \} \| \{ `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER_ORGANIZATION_LIST; `variables`: \{ `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `orderBy?`: `undefined` = 'createdAt_ASC'; `skip?`: `undefined` = 0 \} \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \} \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/screens/OrgList/OrgListMocks.ts#L171)

---

### MOCKS_WITH_ERROR

• `Const` **MOCKS_WITH_ERROR**: (\{ `error?`: `undefined` ; `request`: \{ `notifyOnNetworkStatusChange`: `boolean` = true; `query`: `DocumentNode` = ORGANIZATION_CONNECTION_LIST; `variables`: \{ `filter`: `string` = ''; `first`: `number` = 8; `id?`: `undefined` = '456'; `orderBy`: `string` = 'createdAt_ASC'; `skip`: `number` = 0 \} \} ; `result`: \{ `data`: \{ `organizationsConnection`: `InterfaceOrgConnectionInfoType`[] = organizations \} \} \} \| \{ `error?`: `undefined` ; `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = USER_ORGANIZATION_LIST; `variables`: \{ `filter?`: `undefined` = ''; `first?`: `undefined` = 8; `id`: `string` = '123'; `orderBy?`: `undefined` = 'createdAt_ASC'; `skip?`: `undefined` = 0 \} \} ; `result`: \{ `data`: `InterfaceUserType` = superAdminUser \} \} \| \{ `error`: `Error` ; `request`: \{ `notifyOnNetworkStatusChange?`: `undefined` = true; `query`: `DocumentNode` = CREATE_SAMPLE_ORGANIZATION_MUTATION; `variables?`: `undefined` \} ; `result?`: `undefined` \})[]

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/screens/OrgList/OrgListMocks.ts#L199)
