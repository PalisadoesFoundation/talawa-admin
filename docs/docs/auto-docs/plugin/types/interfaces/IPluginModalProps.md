[Admin Docs](/)

***

# Interface: IPluginModalProps

Defined in: [src/plugin/types.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L111)

## Properties

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](IInstalledPlugin.md)

Defined in: [src/plugin/types.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L118)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](IInstalledPlugin.md)

***

### installPlugin()

> **installPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L119)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`

***

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

Defined in: [src/plugin/types.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L117)

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

***

### loading

> **loading**: `boolean`

Defined in: [src/plugin/types.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L116)

***

### meta

> **meta**: [`IPluginMeta`](IPluginMeta.md)

Defined in: [src/plugin/types.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L115)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/plugin/types.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L113)

#### Returns

`void`

***

### pluginId

> **pluginId**: `string`

Defined in: [src/plugin/types.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L114)

***

### show

> **show**: `boolean`

Defined in: [src/plugin/types.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L112)

***

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `void`

Defined in: [src/plugin/types.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L120)

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

Defined in: [src/plugin/types.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L124)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`
