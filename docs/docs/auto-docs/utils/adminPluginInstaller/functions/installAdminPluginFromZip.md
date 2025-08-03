[Admin Docs](/)

***

# Function: installAdminPluginFromZip()

> **installAdminPluginFromZip**(`__namedParameters`): `Promise`\<[`AdminPluginInstallationResult`](../interfaces/AdminPluginInstallationResult.md)\>

Defined in: [src/utils/adminPluginInstaller.ts:251](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/adminPluginInstaller.ts#L251)

Installs a plugin from a zip file (supports both admin and API)
Flow: 1) Create plugin in DB, 2) Install files, 3) Let API handle table creation

## Parameters

### \_\_namedParameters

[`AdminPluginInstallationOptions`](../interfaces/AdminPluginInstallationOptions.md)

## Returns

`Promise`\<[`AdminPluginInstallationResult`](../interfaces/AdminPluginInstallationResult.md)\>
