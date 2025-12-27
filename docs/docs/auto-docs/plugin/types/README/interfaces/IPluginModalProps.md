[**talawa-admin**](README.md)

***

# Interface: IPluginModalProps

Defined in: [src/plugin/types.ts:167](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L167)

## Properties

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](plugin\types\README\interfaces\IInstalledPlugin.md)

Defined in: [src/plugin/types.ts:174](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L174)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](plugin\types\README\interfaces\IInstalledPlugin.md)

***

### installPlugin()

> **installPlugin**: (`plugin`) => `void`

Defined in: [src/plugin/types.ts:175](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L175)

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

#### Returns

`void`

***

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

Defined in: [src/plugin/types.ts:173](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L173)

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

***

### loading

> **loading**: `boolean`

Defined in: [src/plugin/types.ts:172](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L172)

***

### meta

> **meta**: [`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

Defined in: [src/plugin/types.ts:171](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L171)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/plugin/types.ts:169](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L169)

#### Returns

`void`

***

### pluginId

> **pluginId**: `string`

Defined in: [src/plugin/types.ts:170](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L170)

***

### show

> **show**: `boolean`

Defined in: [src/plugin/types.ts:168](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L168)

***

### togglePluginStatus()

> **togglePluginStatus**: (`plugin`, `status`) => `void`

Defined in: [src/plugin/types.ts:176](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L176)

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

Defined in: [src/plugin/types.ts:180](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/types.ts#L180)

#### Parameters

##### plugin

[`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)

#### Returns

`void`
