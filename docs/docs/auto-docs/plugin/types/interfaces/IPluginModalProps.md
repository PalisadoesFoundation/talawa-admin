[Admin Docs](/)

***

# Interface: IPluginModalProps

Defined in: src/plugin/types.ts:167

## Properties

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](IInstalledPlugin.md)

Defined in: src/plugin/types.ts:174

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](IInstalledPlugin.md)

***

### installPlugin()

> **installPlugin**: (`plugin`) => `void`

Defined in: src/plugin/types.ts:175

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`

***

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

Defined in: src/plugin/types.ts:173

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

***

### loading

> **loading**: `boolean`

Defined in: src/plugin/types.ts:172

***

### meta

> **meta**: [`IPluginMeta`](IPluginMeta.md)

Defined in: src/plugin/types.ts:171

***

### onHide()

> **onHide**: () => `void`

Defined in: src/plugin/types.ts:169

#### Returns

`void`

***

### pluginId

> **pluginId**: `string`

Defined in: src/plugin/types.ts:170

***

### show

> **show**: `boolean`

Defined in: src/plugin/types.ts:168

***

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `void`

Defined in: src/plugin/types.ts:176

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

Defined in: src/plugin/types.ts:180

#### Parameters

##### plugin

[`IPluginMeta`](IPluginMeta.md)

#### Returns

`void`
