[Admin Docs](/)

***

# Variable: actionItemCategoryListQuery

> `const` **actionItemCategoryListQuery**: `object`

Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:408](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationActionItems/testObject.mocks.ts#L408)

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
