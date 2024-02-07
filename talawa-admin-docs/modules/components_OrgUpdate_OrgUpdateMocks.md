[talawa-admin](../README.md) / [Modules](../modules.md) / components/OrgUpdate/OrgUpdateMocks

# Module: components/OrgUpdate/OrgUpdateMocks

## Table of contents

### Variables

- [MOCKS](components_OrgUpdate_OrgUpdateMocks.md#mocks)
- [MOCKS\_ERROR\_ORGLIST](components_OrgUpdate_OrgUpdateMocks.md#mocks_error_orglist)
- [MOCKS\_ERROR\_UPDATE\_ORGLIST](components_OrgUpdate_OrgUpdateMocks.md#mocks_error_update_orglist)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables`: \{ `address?`: `undefined` ; `description?`: `undefined` = 'This is a new update'; `id`: `string` = '123'; `image?`: `undefined` ; `name?`: `undefined` = ''; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \}  \} ; `result`: \{ `data`: \{ `organizations`: \{ `_id`: `string` = '123'; `address`: \{ `city`: `string` = 'Kingston'; `countryCode`: `string` = 'JM'; `dependentLocality`: `string` = 'Sample Dependent Locality'; `line1`: `string` = '123 Jamaica Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = 'JM12345'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Kingston Parish' \} ; `admins`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `blockedUsers`: `never`[] = []; `creator`: \{ `email`: `string` = 'johndoe@example.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `description`: `string` = 'Equitable Access to STEM Education Jobs'; `image`: ``null`` = null; `members`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `membershipRequests`: \{ `_id`: `string` = '456'; `user`: \{ `email`: `string` = 'samsmith@gmail.com'; `firstName`: `string` = 'Sam'; `lastName`: `string` = 'Smith' \}  \} ; `name`: `string` = 'Palisadoes'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}[] ; `updateOrganization?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = UPDATE\_ORGANIZATION\_MUTATION; `variables`: \{ `address`: \{ `city`: `string` = 'Kingston'; `countryCode`: `string` = 'JM'; `dependentLocality`: `string` = 'Sample Dependent Locality'; `line1`: `string` = '123 Jamaica Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = 'JM12345'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Kingston Parish' \} ; `description`: `string` = 'This is an updated test organization'; `id`: `string` = '123'; `image`: `File` ; `name`: `string` = 'Updated Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}  \} ; `result`: \{ `data`: \{ `organizations?`: `undefined` ; `updateOrganization`: \{ `_id`: `string` = '123'; `address`: \{ `city`: `string` = 'Kingston'; `countryCode`: `string` = 'JM'; `dependentLocality`: `string` = 'Sample Dependent Locality'; `line1`: `string` = '123 Jamaica Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = 'JM12345'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Kingston Parish' \} ; `description`: `string` = 'This is an updated test organization'; `name`: `string` = 'Updated Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}  \}  \}  \})[]

#### Defined in

[src/components/OrgUpdate/OrgUpdateMocks.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/f07248e/src/components/OrgUpdate/OrgUpdateMocks.ts#L4)

___

### MOCKS\_ERROR\_ORGLIST

• `Const` **MOCKS\_ERROR\_ORGLIST**: \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables`: \{ `id`: `string` = '123' \}  \}  \}[]

#### Defined in

[src/components/OrgUpdate/OrgUpdateMocks.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/f07248e/src/components/OrgUpdate/OrgUpdateMocks.ts#L109)

___

### MOCKS\_ERROR\_UPDATE\_ORGLIST

• `Const` **MOCKS\_ERROR\_UPDATE\_ORGLIST**: (\{ `erorr?`: `undefined` ; `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables`: \{ `address?`: `undefined` ; `description?`: `undefined` = 'This is a new update'; `id`: `string` = '123'; `image?`: `undefined` ; `name?`: `undefined` = ''; `userRegistrationRequired?`: `undefined` = true; `visibleInSearch?`: `undefined` = false \}  \} ; `result`: \{ `data`: \{ `organizations`: \{ `_id`: `string` = '123'; `address`: \{ `city`: `string` = 'Kingston'; `countryCode`: `string` = 'JM'; `dependentLocality`: `string` = 'Sample Dependent Locality'; `line1`: `string` = '123 Jamaica Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = 'JM12345'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Kingston Parish' \} ; `admins`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `blockedUsers`: `never`[] = []; `creator`: \{ `email`: `string` = 'johndoe@example.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `description`: `string` = 'Equitable Access to STEM Education Jobs'; `image`: ``null`` = null; `members`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `membershipRequests`: \{ `_id`: `string` = '456'; `user`: \{ `email`: `string` = 'samsmith@gmail.com'; `firstName`: `string` = 'Sam'; `lastName`: `string` = 'Smith' \}  \} ; `name`: `string` = 'Palisadoes'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}[]  \}  \}  \} \| \{ `erorr`: `Error` ; `request`: \{ `query`: `DocumentNode` = UPDATE\_ORGANIZATION\_MUTATION; `variables`: \{ `address`: \{ `city`: `string` = 'Kingston'; `countryCode`: `string` = 'JM'; `dependentLocality`: `string` = 'Sample Dependent Locality'; `line1`: `string` = '123 Jamaica Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = 'JM12345'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Kingston Parish' \} ; `description`: `string` = 'This is an updated test organization'; `id`: `string` = '123'; `image`: `File` ; `name`: `string` = 'Updated Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}  \} ; `result?`: `undefined`  \})[]

#### Defined in

[src/components/OrgUpdate/OrgUpdateMocks.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/f07248e/src/components/OrgUpdate/OrgUpdateMocks.ts#L119)
