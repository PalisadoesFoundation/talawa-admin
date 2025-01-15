[**talawa-admin**](../../../../../../README.md)

***

[talawa-admin](../../../../../../README.md) / [components/AddOn/core/AddOnEntry/AddOnEntryMocks](../README.md) / ADD\_ON\_ENTRY\_MOCK

# Variable: ADD\_ON\_ENTRY\_MOCK

> `const` **ADD\_ON\_ENTRY\_MOCK**: `object`[]

Defined in: [src/components/AddOn/core/AddOnEntry/AddOnEntryMocks.ts:13](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/components/AddOn/core/AddOnEntry/AddOnEntryMocks.ts#L13)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `UPDATE_INSTALL_STATUS_PLUGIN_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `'1'`

#### request.variables.orgId

> **orgId**: `string` = `'undefined'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.updatePluginStatus

> **updatePluginStatus**: `object` = `updatePluginStatus`

#### result.data.updatePluginStatus.\_id

> **\_id**: `string` = `'123'`

#### result.data.updatePluginStatus.pluginCreatedBy

> **pluginCreatedBy**: `string` = `'John Doe'`

#### result.data.updatePluginStatus.pluginDesc

> **pluginDesc**: `string` = `'This is a sample plugin description.'`

#### result.data.updatePluginStatus.pluginName

> **pluginName**: `string` = `'Sample Plugin'`

#### result.data.updatePluginStatus.uninstalledOrgs

> **uninstalledOrgs**: `any`[] = `[]`
