[**talawa-admin**](../../../../../README.md)

***

# Function: usePluginActions()

> **usePluginActions**(`__namedParameters`): `object`

Defined in: [src/screens/PluginStore/hooks/usePluginActions.ts:19](https://github.com/iamanishx/talawa-admin/blob/298365ee22a86aaef2b666c60099ffc41d2bbce7/src/screens/PluginStore/hooks/usePluginActions.ts#L19)

## Parameters

### \_\_namedParameters

`UsePluginActionsProps`

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

[`IPluginMeta`](../../../../../plugin/types/interfaces/IPluginMeta.md)

#### Returns

`Promise`\<`void`\>

### handleUninstallConfirm()

> **handleUninstallConfirm**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### loading

> **loading**: `boolean`

### pluginToUninstall

> **pluginToUninstall**: [`IPluginMeta`](../../../../../plugin/types/interfaces/IPluginMeta.md)

### showUninstallModal

> **showUninstallModal**: `boolean`

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `Promise`\<`void`\>

#### Parameters

##### plugin

[`IPluginMeta`](../../../../../plugin/types/interfaces/IPluginMeta.md)

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`void`\>

### uninstallPlugin()

> **uninstallPlugin**: (`plugin`) => `void`

#### Parameters

##### plugin

[`IPluginMeta`](../../../../../plugin/types/interfaces/IPluginMeta.md)

#### Returns

`void`
