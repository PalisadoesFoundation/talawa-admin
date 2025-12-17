[Admin Docs](/)

***

# Class: ExtensionRegistryManager

Defined in: src/plugin/managers/extension-registry.ts:12

## Constructors

### Constructor

> **new ExtensionRegistryManager**(): `ExtensionRegistryManager`

#### Returns

`ExtensionRegistryManager`

## Methods

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`): [`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)\[`T`\]

Defined in: src/plugin/managers/extension-registry.ts:245

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

Defined in: src/plugin/managers/extension-registry.ts:30

#### Returns

[`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)

***

### registerExtensionPoints()

> **registerExtensionPoints**(`pluginId`, `manifest`): `void`

Defined in: src/plugin/managers/extension-registry.ts:34

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

Defined in: src/plugin/managers/extension-registry.ts:239

#### Parameters

##### pluginId

`string`

#### Returns

`void`
