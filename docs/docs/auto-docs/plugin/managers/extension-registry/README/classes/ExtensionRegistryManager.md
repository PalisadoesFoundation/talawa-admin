[Admin Docs](/)

***

# Class: ExtensionRegistryManager

Defined in: [src/plugin/managers/extension-registry.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/extension-registry.ts#L12)

## Constructors

### new ExtensionRegistryManager()

> **new ExtensionRegistryManager**(): `ExtensionRegistryManager`

#### Returns

`ExtensionRegistryManager`

## Methods

### getExtensionPoints()

> **getExtensionPoints**\<`T`\>(`type`, `userPermissions`, `isAdmin`, `isOrg`?): [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)\[`T`\]

Defined in: [src/plugin/managers/extension-registry.ts:232](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/extension-registry.ts#L232)

#### Type Parameters

##### T

`T` *extends* keyof [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

#### Parameters

##### type

`T`

##### userPermissions

`string`[] = `[]`

##### isAdmin

`boolean` = `false`

##### isOrg?

`boolean`

#### Returns

[`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)\[`T`\]

***

### getExtensionRegistry()

> **getExtensionRegistry**(): [`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

Defined in: [src/plugin/managers/extension-registry.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/extension-registry.ts#L29)

#### Returns

[`IExtensionRegistry`](plugin\types\README\interfaces\IExtensionRegistry.md)

***

### registerExtensionPoints()

> **registerExtensionPoints**(`pluginId`, `manifest`): `void`

Defined in: [src/plugin/managers/extension-registry.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/extension-registry.ts#L33)

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

Defined in: [src/plugin/managers/extension-registry.ts:226](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/extension-registry.ts#L226)

#### Parameters

##### pluginId

`string`

#### Returns

`void`
