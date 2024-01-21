[talawa-admin](../README.md) / [Modules](../modules.md) / components/OrgUpdate/OrgUpdateMocks

# Module: components/OrgUpdate/OrgUpdateMocks

## Table of contents

### Variables

- [MOCKS](components_OrgUpdate_OrgUpdateMocks.md#mocks)
- [MOCKS\_ERROR\_ORGLIST](components_OrgUpdate_OrgUpdateMocks.md#mocks_error_orglist)
- [MOCKS\_ERROR\_UPDATE\_ORGLIST](components_OrgUpdate_OrgUpdateMocks.md#mocks_error_update_orglist)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables`: \{ `description?`: `undefined` = 'This is a new update'; `id`: `string` = '123'; `image?`: `undefined` ; `location?`: `undefined` = 'New Delhi'; `name?`: `undefined` = ''; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \}  \} ; `result`: \{ `data`: \{ `organizations`: \{ `_id`: `string` = '123'; `admins`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `blockedUsers`: `never`[] = []; `creator`: \{ `email`: `string` = 'johndoe@example.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `description`: `string` = 'Equitable Access to STEM Education Jobs'; `image`: ``null`` = null; `location`: `string` = 'Jamaica'; `members`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `membershipRequests`: \{ `_id`: `string` = '456'; `user`: \{ `email`: `string` = 'samsmith@gmail.com'; `firstName`: `string` = 'Sam'; `lastName`: `string` = 'Smith' \}  \} ; `name`: `string` = 'Palisadoes'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}[] ; `updateOrganization?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = UPDATE\_ORGANIZATION\_MUTATION; `variables`: \{ `description`: `string` = 'This is an updated test organization'; `id`: `string` = '123'; `image`: `File` ; `location`: `string` = 'Updated location'; `name`: `string` = 'Updated Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}  \} ; `result`: \{ `data`: \{ `organizations?`: `undefined` ; `updateOrganization`: \{ `_id`: `string` = '123'; `description`: `string` = 'This is an updated test organization'; `location`: `string` = 'Updated location'; `name`: `string` = 'Updated Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}  \}  \}  \})[]

#### Defined in

[src/components/OrgUpdate/OrgUpdateMocks.ts:4](https://github.com/palisadoes/talawa-admin/blob/5828937/src/components/OrgUpdate/OrgUpdateMocks.ts#L4)

___

### MOCKS\_ERROR\_ORGLIST

• `Const` **MOCKS\_ERROR\_ORGLIST**: \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables`: \{ `id`: `string` = '123' \}  \}  \}[]

#### Defined in

[src/components/OrgUpdate/OrgUpdateMocks.ts:82](https://github.com/palisadoes/talawa-admin/blob/5828937/src/components/OrgUpdate/OrgUpdateMocks.ts#L82)

___

### MOCKS\_ERROR\_UPDATE\_ORGLIST

• `Const` **MOCKS\_ERROR\_UPDATE\_ORGLIST**: (\{ `erorr?`: `undefined` ; `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables`: \{ `description?`: `undefined` = 'This is a new update'; `id`: `string` = '123'; `image?`: `undefined` ; `location?`: `undefined` = 'New Delhi'; `name?`: `undefined` = ''; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \}  \} ; `result`: \{ `data`: \{ `organizations`: \{ `_id`: `string` = '123'; `admins`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `blockedUsers`: `never`[] = []; `creator`: \{ `email`: `string` = 'johndoe@example.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `description`: `string` = 'Equitable Access to STEM Education Jobs'; `image`: ``null`` = null; `location`: `string` = 'Jamaica'; `members`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `membershipRequests`: \{ `_id`: `string` = '456'; `user`: \{ `email`: `string` = 'samsmith@gmail.com'; `firstName`: `string` = 'Sam'; `lastName`: `string` = 'Smith' \}  \} ; `name`: `string` = 'Palisadoes'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}[]  \}  \}  \} \| \{ `erorr`: `Error` ; `request`: \{ `query`: `DocumentNode` = UPDATE\_ORGANIZATION\_MUTATION; `variables`: \{ `description`: `string` = 'This is an updated test organization'; `id`: `string` = '123'; `image`: `File` ; `location`: `string` = 'Updated location'; `name`: `string` = 'Updated Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}  \} ; `result?`: `undefined`  \})[]

#### Defined in

[src/components/OrgUpdate/OrgUpdateMocks.ts:92](https://github.com/palisadoes/talawa-admin/blob/5828937/src/components/OrgUpdate/OrgUpdateMocks.ts#L92)
