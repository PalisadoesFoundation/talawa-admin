[**talawa-admin**](README.md)

***

# Function: installAdminPluginFromZip()

> **installAdminPluginFromZip**(`__namedParameters`): `Promise`\<[`IAdminPluginInstallationResult`](utils\adminPluginInstaller\README\interfaces\IAdminPluginInstallationResult.md)\>

Defined in: [src/utils/adminPluginInstaller.ts:252](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/adminPluginInstaller.ts#L252)

Installs a plugin from a zip file (supports both admin and API)
Flow: 1) Create plugin in DB, 2) Install files, 3) Installation is handled separately

## Parameters

### \_\_namedParameters

[`IAdminPluginInstallationOptions`](utils\adminPluginInstaller\README\interfaces\IAdminPluginInstallationOptions.md)

## Returns

`Promise`\<[`IAdminPluginInstallationResult`](utils\adminPluginInstaller\README\interfaces\IAdminPluginInstallationResult.md)\>
