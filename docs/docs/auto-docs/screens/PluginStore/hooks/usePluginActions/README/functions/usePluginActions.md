[**talawa-admin**](README.md)

***

# Function: usePluginActions()

> **usePluginActions**(`__namedParameters`): `object`

Defined in: [src/screens/PluginStore/hooks/usePluginActions.ts:21](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/screens/PluginStore/hooks/usePluginActions.ts#L21)

## Parameters

### \_\_namedParameters

`IUsePluginActionsProps`

## Returns

`object`

### closeUninstallModal()

> **closeUninstallModal**: () => `void`

#### Returns

`void`

### handleInstallPlugin()

> **handleInstallPlugin**: (`plugin`) => `Promise`\<`void`\>

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

#### Returns

`Promise`\<`void`\>

### handleUninstallConfirm()

> **handleUninstallConfirm**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### loading

> **loading**: `boolean`

### pluginToUninstall

> **pluginToUninstall**: [`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

### showUninstallModal

> **showUninstallModal**: `boolean`

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `Promise`\<`void`\>

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`void`\>

### uninstallPlugin()

> **uninstallPlugin**: (`plugin`) => `void`

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

#### Returns

`void`
