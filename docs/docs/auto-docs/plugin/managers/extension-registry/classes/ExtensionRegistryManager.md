[**talawa-admin**](../../../../README.md)

***

# Class: ExtensionRegistryManager

Defined in: [src/plugin/managers/extension-registry.ts:12](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/plugin/managers/extension-registry.ts#L12)

## Constructors

### Constructor

> **new ExtensionRegistryManager**(): `ExtensionRegistryManager`

#### Returns

`ExtensionRegistryManager`

## Methods

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`): [`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)\[`T`\]

Defined in: [src/plugin/managers/extension-registry.ts:245](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/plugin/managers/extension-registry.ts#L245)

#### Type Parameters

##### T

`T` *extends* keyof [`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)

#### Parameters

##### type

`T`

#### Returns

[`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)\[`T`\]

***

### getExtensionRegistry()

> **getExtensionRegistry**(): [`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)

Defined in: [src/plugin/managers/extension-registry.ts:30](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/plugin/managers/extension-registry.ts#L30)

#### Returns

[`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)

***

### registerExtensionPoints()

> **registerExtensionPoints**(`pluginId`, `manifest`): `void`

Defined in: [src/plugin/managers/extension-registry.ts:34](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/plugin/managers/extension-registry.ts#L34)

#### Parameters

##### pluginId

`string`

##### manifest

[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)

#### Returns

`void`

***

### unregisterExtensionPoints()

> **unregisterExtensionPoints**(`pluginId`): `void`

Defined in: [src/plugin/managers/extension-registry.ts:239](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/plugin/managers/extension-registry.ts#L239)

#### Parameters

##### pluginId

`string`

#### Returns

`void`
