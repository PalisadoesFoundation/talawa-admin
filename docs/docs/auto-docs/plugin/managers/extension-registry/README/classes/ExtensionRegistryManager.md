[**talawa-admin**](README.md)

***

# Class: ExtensionRegistryManager

Defined in: [src/plugin/managers/extension-registry.ts:12](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/extension-registry.ts#L12)

## Constructors

### new ExtensionRegistryManager()

> **new ExtensionRegistryManager**(): `ExtensionRegistryManager`

#### Returns

`ExtensionRegistryManager`

## Methods

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`): [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)\[`T`\]

Defined in: [src/plugin/managers/extension-registry.ts:245](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/extension-registry.ts#L245)

#### Type Parameters

##### T

`T` *extends* keyof [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

#### Parameters

##### type

`T`

#### Returns

[`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)\[`T`\]

***

### getExtensionRegistry()

> **getExtensionRegistry**(): [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

Defined in: [src/plugin/managers/extension-registry.ts:30](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/extension-registry.ts#L30)

#### Returns

[`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

***

### registerExtensionPoints()

> **registerExtensionPoints**(`pluginId`, `manifest`): `void`

Defined in: [src/plugin/managers/extension-registry.ts:34](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/extension-registry.ts#L34)

#### Parameters

##### pluginId

`string`

##### manifest

[`IPluginManifest`](plugin\types\README\interfaces\IPluginManifest.md)

#### Returns

`void`

***

### unregisterExtensionPoints()

> **unregisterExtensionPoints**(`pluginId`): `void`

Defined in: [src/plugin/managers/extension-registry.ts:239](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/plugin/managers/extension-registry.ts#L239)

#### Parameters

##### pluginId

`string`

#### Returns

`void`
