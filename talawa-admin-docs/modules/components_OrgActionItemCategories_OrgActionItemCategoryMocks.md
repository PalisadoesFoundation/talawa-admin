[talawa-admin](../README.md) / [Modules](../modules.md) / components/OrgActionItemCategories/OrgActionItemCategoryMocks

# Module: components/OrgActionItemCategories/OrgActionItemCategoryMocks

## Table of contents

### Variables

- [MOCKS](components_OrgActionItemCategories_OrgActionItemCategoryMocks.md#mocks)
- [MOCKS\_ERROR\_MUTATIONS](components_OrgActionItemCategories_OrgActionItemCategoryMocks.md#mocks_error_mutations)
- [MOCKS\_ERROR\_QUERY](components_OrgActionItemCategories_OrgActionItemCategoryMocks.md#mocks_error_query)

## Variables

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = ACTION\_ITEM\_CATEGORY\_LIST; `variables`: \{ `actionItemCategoryId?`: `undefined` = '1'; `isDisabled?`: `undefined` = true; `name?`: `undefined` = 'ActionItemCategory 1 updated'; `organizationId`: `string` = '123' \}  \} ; `result`: \{ `data`: \{ `actionItemCategoriesByOrganization`: \{ `_id`: `string` = '1'; `isDisabled`: `boolean` = false; `name`: `string` = 'ActionItemCategory 1' \}[] ; `createActionItemCategory?`: `undefined` ; `updateActionItemCategory?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = CREATE\_ACTION\_ITEM\_CATEGORY\_MUTATION; `variables`: \{ `actionItemCategoryId?`: `undefined` = '1'; `isDisabled?`: `undefined` = true; `name`: `string` = 'ActionItemCategory 4'; `organizationId`: `string` = '123' \}  \} ; `result`: \{ `data`: \{ `actionItemCategoriesByOrganization?`: `undefined` ; `createActionItemCategory`: \{ `_id`: `string` = '4' \} ; `updateActionItemCategory?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = UPDATE\_ACTION\_ITEM\_CATEGORY\_MUTATION; `variables`: \{ `actionItemCategoryId`: `string` = '1'; `isDisabled?`: `undefined` = true; `name`: `string` = 'ActionItemCategory 1 updated'; `organizationId?`: `undefined` = '123' \}  \} ; `result`: \{ `data`: \{ `actionItemCategoriesByOrganization?`: `undefined` ; `createActionItemCategory?`: `undefined` ; `updateActionItemCategory`: \{ `_id`: `string` = '1' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = UPDATE\_ACTION\_ITEM\_CATEGORY\_MUTATION; `variables`: \{ `actionItemCategoryId`: `string` = '1'; `isDisabled`: `boolean` = true; `name?`: `undefined` = 'ActionItemCategory 1 updated'; `organizationId?`: `undefined` = '123' \}  \} ; `result`: \{ `data`: \{ `actionItemCategoriesByOrganization?`: `undefined` ; `createActionItemCategory?`: `undefined` ; `updateActionItemCategory`: \{ `_id`: `string` = '1' \}  \}  \}  \})[]

#### Defined in

[src/components/OrgActionItemCategories/OrgActionItemCategoryMocks.ts:8](https://github.com/meetulr/talawa-admin/blob/40ecfbe/src/components/OrgActionItemCategories/OrgActionItemCategoryMocks.ts#L8)

___

### MOCKS\_ERROR\_MUTATIONS

• `Const` **MOCKS\_ERROR\_MUTATIONS**: (\{ `error?`: `undefined` ; `request`: \{ `query`: `DocumentNode` = ACTION\_ITEM\_CATEGORY\_LIST; `variables`: \{ `actionItemCategoryId?`: `undefined` = '1'; `isDisabled?`: `undefined` = true; `name?`: `undefined` = 'ActionItemCategory 1 updated'; `organizationId`: `string` = '123' \}  \} ; `result`: \{ `data`: \{ `actionItemCategoriesByOrganization`: \{ `_id`: `string` = '1'; `isDisabled`: `boolean` = false; `name`: `string` = 'ActionItemCategory 1' \}[]  \}  \}  \} \| \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = CREATE\_ACTION\_ITEM\_CATEGORY\_MUTATION; `variables`: \{ `actionItemCategoryId?`: `undefined` = '1'; `isDisabled?`: `undefined` = true; `name`: `string` = 'ActionItemCategory 4'; `organizationId`: `string` = '123' \}  \} ; `result?`: `undefined`  \} \| \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = UPDATE\_ACTION\_ITEM\_CATEGORY\_MUTATION; `variables`: \{ `actionItemCategoryId`: `string` = '1'; `isDisabled?`: `undefined` = true; `name`: `string` = 'ActionItemCategory 1 updated'; `organizationId?`: `undefined` = '123' \}  \} ; `result?`: `undefined`  \} \| \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = UPDATE\_ACTION\_ITEM\_CATEGORY\_MUTATION; `variables`: \{ `actionItemCategoryId`: `string` = '1'; `isDisabled`: `boolean` = true; `name?`: `undefined` = 'ActionItemCategory 1 updated'; `organizationId?`: `undefined` = '123' \}  \} ; `result?`: `undefined`  \})[]

#### Defined in

[src/components/OrgActionItemCategories/OrgActionItemCategoryMocks.ts:109](https://github.com/meetulr/talawa-admin/blob/40ecfbe/src/components/OrgActionItemCategories/OrgActionItemCategoryMocks.ts#L109)

___

### MOCKS\_ERROR\_QUERY

• `Const` **MOCKS\_ERROR\_QUERY**: \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = ACTION\_ITEM\_CATEGORY\_LIST; `variables`: \{ `organizationId`: `string` = '123' \}  \}  \}[]

#### Defined in

[src/components/OrgActionItemCategories/OrgActionItemCategoryMocks.ts:99](https://github.com/meetulr/talawa-admin/blob/40ecfbe/src/components/OrgActionItemCategories/OrgActionItemCategoryMocks.ts#L99)
