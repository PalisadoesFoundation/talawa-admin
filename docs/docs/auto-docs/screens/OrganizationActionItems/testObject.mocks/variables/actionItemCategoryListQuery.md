[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [screens/OrganizationActionItems/testObject.mocks](../README.md) / actionItemCategoryListQuery

# Variable: actionItemCategoryListQuery

> `const` **actionItemCategoryListQuery**: `object`

Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:408](https://github.com/gautam-divyanshu/talawa-admin/blob/334f0f7773e45df65600a1da08d00c41806347e4/src/screens/OrganizationActionItems/testObject.mocks.ts#L408)

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
