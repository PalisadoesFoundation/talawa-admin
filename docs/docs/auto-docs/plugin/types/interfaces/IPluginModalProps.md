[Admin Docs](/)

***

# Interface: IPluginModalProps

Defined in: [src/plugin/types.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L143)

## Properties

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](IInstalledPlugin.md)

Defined in: [src/plugin/types.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L150)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](IInstalledPlugin.md)

***

### installPlugin()

> **installPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L151)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`

***

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

Defined in: [src/plugin/types.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L149)

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

***

### loading

> **loading**: `boolean`

Defined in: [src/plugin/types.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L148)

***

### meta

> **meta**: [`IPluginMeta`](IPluginMeta.md)

Defined in: [src/plugin/types.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L147)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/plugin/types.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L145)

#### Returns

`void`

***

### pluginId

> **pluginId**: `string`

Defined in: [src/plugin/types.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L146)

***

### show

> **show**: `boolean`

Defined in: [src/plugin/types.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L144)

***

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `void`

Defined in: [src/plugin/types.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L152)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

##### status

`"active"` | `"inactive"`

#### Returns

`void`

***

### uninstallPlugin()

> **uninstallPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L156)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`
