[**talawa-admin**](../../../README.md)

***

# Function: installAdminPluginFromZip()

> **installAdminPluginFromZip**(`__namedParameters`): `Promise`\<[`IAdminPluginInstallationResult`](../interfaces/IAdminPluginInstallationResult.md)\>

Defined in: [src/utils/adminPluginInstaller.ts:252](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/adminPluginInstaller.ts#L252)

Installs a plugin from a zip file (supports both admin and API)
Flow: 1) Create plugin in DB, 2) Install files, 3) Installation is handled separately

## Parameters

### \_\_namedParameters

[`IAdminPluginInstallationOptions`](../interfaces/IAdminPluginInstallationOptions.md)

## Returns

`Promise`\<[`IAdminPluginInstallationResult`](../interfaces/IAdminPluginInstallationResult.md)\>
