[Admin Docs](/)

***

# Variable: actionItemCategoryListQuery

> `const` **actionItemCategoryListQuery**: `object`

<<<<<<< HEAD
Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:408](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationActionItems/testObject.mocks.ts#L408)
=======
Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:408](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/testObject.mocks.ts#L408)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ACTION_ITEM_CATEGORY_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.organizationId

> **organizationId**: `string` = `'orgId'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.is\_disabled

> **is\_disabled**: `boolean` = `false`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.actionItemCategoriesByOrganization

> **actionItemCategoriesByOrganization**: (\{ `_id`: `string`; `createdAt`: `string`; `creator`: \{ `_id`: `string`; `firstName`: `string`; `lastName`: `string`; \}; `isDisabled`: `boolean`; `name`: `string`; \} \| \{ `_id`: `undefined`; `createdAt`: `string`; `creator`: \{ `_id`: `undefined`; `firstName`: `string`; `lastName`: `string`; \}; `isDisabled`: `boolean`; `name`: `string`; \})[]
