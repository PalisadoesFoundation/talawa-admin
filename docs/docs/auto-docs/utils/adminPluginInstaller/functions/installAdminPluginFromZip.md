[**talawa-admin**](../../../README.md)

***

# Function: installAdminPluginFromZip()

> **installAdminPluginFromZip**(`__namedParameters`): `Promise`\<[`AdminPluginInstallationResult`](../interfaces/AdminPluginInstallationResult.md)\>

Defined in: [src/utils/adminPluginInstaller.ts:251](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/adminPluginInstaller.ts#L251)

Installs a plugin from a zip file (supports both admin and API)
Flow: 1) Create plugin in DB, 2) Install files, 3) Installation is handled separately

## Parameters

### \_\_namedParameters

[`AdminPluginInstallationOptions`](../interfaces/AdminPluginInstallationOptions.md)

## Returns

`Promise`\<[`AdminPluginInstallationResult`](../interfaces/AdminPluginInstallationResult.md)\>
