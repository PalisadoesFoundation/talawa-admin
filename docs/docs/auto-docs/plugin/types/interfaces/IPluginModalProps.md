[Admin Docs](/)

***

# Interface: IPluginModalProps

Defined in: [src/plugin/types.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L108)

## Properties

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](IInstalledPlugin.md)

Defined in: [src/plugin/types.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L115)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](IInstalledPlugin.md)

***

### installPlugin()

> **installPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L116)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`

***

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

Defined in: [src/plugin/types.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L114)

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

***

### loading

> **loading**: `boolean`

Defined in: [src/plugin/types.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L113)

***

### meta

> **meta**: [`IPluginMeta`](IPluginMeta.md)

Defined in: [src/plugin/types.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L112)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/plugin/types.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L110)

#### Returns

`void`

***

### pluginId

> **pluginId**: `string`

Defined in: [src/plugin/types.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L111)

***

### show

> **show**: `boolean`

Defined in: [src/plugin/types.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L109)

***

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `void`

Defined in: [src/plugin/types.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L117)

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

Defined in: [src/plugin/types.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L121)

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`
