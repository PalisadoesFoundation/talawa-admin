[Admin Docs](/)

***

# Variable: mocks

> `const` **mocks**: `object`[]

Defined in: [src/components/AddOn/AddOnMocks.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/AddOnMocks.ts#L178)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ADD_PLUGIN_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.installedOrgs

> **installedOrgs**: `string`[]

#### request.variables.pluginCreatedBy

> **pluginCreatedBy**: `string` = `'AdminTest Creator'`

#### request.variables.pluginDesc

> **pluginDesc**: `string` = `'Test Description'`

#### request.variables.pluginInstallStatus

> **pluginInstallStatus**: `boolean` = `false`

#### request.variables.pluginName

> **pluginName**: `string` = `'Test Plugin'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.createPlugin

> **createPlugin**: `object`

#### result.data.createPlugin.\_id

> **\_id**: `string` = `'1'`

#### result.data.createPlugin.pluginCreatedBy

> **pluginCreatedBy**: `string` = `'AdminTest Creator'`

#### result.data.createPlugin.pluginDesc

> **pluginDesc**: `string` = `'Test Description'`

#### result.data.createPlugin.pluginName

> **pluginName**: `string` = `'Test Plugin'`
