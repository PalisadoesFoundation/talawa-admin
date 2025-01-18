[Admin Docs](/)

***

# Variable: ADD\_ON\_ENTRY\_MOCK

> `const` **ADD\_ON\_ENTRY\_MOCK**: `object`[]

Defined in: [src/components/AddOn/core/AddOnEntry/AddOnEntryMocks.ts:13](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/components/AddOn/core/AddOnEntry/AddOnEntryMocks.ts#L13)

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
