[Admin Docs](/)

***

# Interface: IPluginModalProps

Defined in: [src/plugin/types.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L165)

## Properties

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](plugin\types\README\interfaces\IInstalledPlugin.md)

Defined in: [src/plugin/types.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L172)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](plugin\types\README\interfaces\IInstalledPlugin.md)

***

### installPlugin()

> **installPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L173)

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

#### Returns

`void`

***

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

Defined in: [src/plugin/types.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L171)

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

***

### loading

> **loading**: `boolean`

Defined in: [src/plugin/types.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L170)

***

### meta

> **meta**: [`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

Defined in: [src/plugin/types.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L169)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/plugin/types.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L167)

#### Returns

`void`

***

### pluginId

> **pluginId**: `string`

Defined in: [src/plugin/types.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L168)

***

### show

> **show**: `boolean`

Defined in: [src/plugin/types.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L166)

***

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `void`

Defined in: [src/plugin/types.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L174)

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

##### status

`"active"` | `"inactive"`

#### Returns

`void`

***

### uninstallPlugin()

> **uninstallPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L178)

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

#### Returns

`void`
