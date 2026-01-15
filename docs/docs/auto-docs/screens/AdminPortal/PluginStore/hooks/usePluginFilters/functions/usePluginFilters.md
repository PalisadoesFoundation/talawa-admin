[**talawa-admin**](../../../../../../README.md)

***

# Function: usePluginFilters()

> **usePluginFilters**(`__namedParameters`): `object`

Defined in: [src/screens/AdminPortal/PluginStore/hooks/usePluginFilters.ts:16](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/screens/AdminPortal/PluginStore/hooks/usePluginFilters.ts#L16)

## Parameters

### \_\_namedParameters

`IUsePluginFiltersProps`

## Returns

`object`

### debouncedSearch()

> **debouncedSearch**: (...`args`) => `void`

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

### filteredPlugins

> **filteredPlugins**: [`IPluginMeta`](../../../../../../plugin/types/interfaces/IPluginMeta.md)[]

### filterState

> **filterState**: `object`

#### filterState.option

> **option**: `string` = `'all'`

#### filterState.selectedOption

> **selectedOption**: `string`

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](../../../../../../plugin/types/interfaces/IInstalledPlugin.md)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](../../../../../../plugin/types/interfaces/IInstalledPlugin.md)

### handleFilterChange()

> **handleFilterChange**: (`value`) => `void`

#### Parameters

##### value

`string` | `number`

#### Returns

`void`

### isInstalled()

> **isInstalled**: (`pluginName`) => `boolean`

#### Parameters

##### pluginName

`string`

#### Returns

`boolean`

### searchTerm

> **searchTerm**: `string`
