[**talawa-admin**](../../../../../../README.md)

***

# Function: usePluginActions()

> **usePluginActions**(`__namedParameters`): `object`

Defined in: [src/screens/AdminPortal/PluginStore/hooks/usePluginActions.ts:17](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/screens/AdminPortal/PluginStore/hooks/usePluginActions.ts#L17)

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

[`IPluginMeta`](../../../../../../plugin/types/interfaces/IPluginMeta.md)

#### Returns

`Promise`\<`void`\>

### handleUninstallConfirm()

> **handleUninstallConfirm**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### loading

> **loading**: `boolean`

### pluginToUninstall

> **pluginToUninstall**: [`IPluginMeta`](../../../../../../plugin/types/interfaces/IPluginMeta.md)

### showUninstallModal

> **showUninstallModal**: `boolean`

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `Promise`\<`void`\>

#### Parameters

##### plugin

[`IPluginMeta`](../../../../../../plugin/types/interfaces/IPluginMeta.md)

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`void`\>

### uninstallPlugin()

> **uninstallPlugin**: (`plugin`) => `void`

#### Parameters

##### plugin

[`IPluginMeta`](../../../../../../plugin/types/interfaces/IPluginMeta.md)

#### Returns

`void`
