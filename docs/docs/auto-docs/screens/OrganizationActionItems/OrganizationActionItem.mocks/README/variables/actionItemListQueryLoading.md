[Admin Docs](/)

***

# Variable: actionItemListQueryLoading

> `const` **actionItemListQueryLoading**: `object`

Defined in: [src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts:275](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/OrganizationActionItem.mocks.ts#L275)

## Type declaration

### delay

> **delay**: `number` = `30000`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ACTION_ITEM_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.organizationId

> **organizationId**: `string` = `'orgId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.actionItemsByOrganization

> **actionItemsByOrganization**: `any`[] = `[]`
