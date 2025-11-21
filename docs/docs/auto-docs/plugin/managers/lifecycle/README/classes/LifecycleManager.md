[Admin Docs](/)

***

# Class: LifecycleManager

Defined in: [src/plugin/managers/lifecycle.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L12)

## Constructors

### new LifecycleManager()

> **new LifecycleManager**(`discoveryManager`, `extensionRegistry`, `eventManager`): `LifecycleManager`

Defined in: [src/plugin/managers/lifecycle.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L15)

#### Parameters

##### discoveryManager

[`DiscoveryManager`](plugin\managers\discovery\README\classes\DiscoveryManager.md)

##### extensionRegistry

[`ExtensionRegistryManager`](plugin\managers\extension-registry\README\classes\ExtensionRegistryManager.md)

##### eventManager

[`EventManager`](plugin\managers\event-manager\README\classes\EventManager.md)

#### Returns

`LifecycleManager`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L141)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L177)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getActivePluginCount()

> **getActivePluginCount**(): `number`

Defined in: [src/plugin/managers/lifecycle.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L52)

#### Returns

`number`

***

### getLoadedPlugin()

> **getLoadedPlugin**(`pluginId`): [`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)

Defined in: [src/plugin/managers/lifecycle.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L25)

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)[]

Defined in: [src/plugin/managers/lifecycle.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L21)

#### Returns

[`ILoadedPlugin`](plugin\types\README\interfaces\ILoadedPlugin.md)[]

***

### getPluginComponent()

> **getPluginComponent**(`pluginId`, `componentName`): `ComponentType`\<\{\}\>

Defined in: [src/plugin/managers/lifecycle.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L32)

#### Parameters

##### pluginId

`string`

##### componentName

`string`

#### Returns

`ComponentType`\<\{\}\>

***

### getPluginCount()

> **getPluginCount**(): `number`

Defined in: [src/plugin/managers/lifecycle.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L48)

#### Returns

`number`

***

### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L213)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L58)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### togglePluginStatus()

> **togglePluginStatus**(`pluginId`, `status`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L130)

#### Parameters

##### pluginId

`string`

##### status

`"active"` | `"inactive"`

#### Returns

`Promise`\<`boolean`\>

***

### uninstallPlugin()

> **uninstallPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L267)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

Defined in: [src/plugin/managers/lifecycle.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/lifecycle.ts#L102)

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
