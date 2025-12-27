[**talawa-admin**](README.md)

***

# Function: usePluginFilters()

> **usePluginFilters**(`__namedParameters`): `object`

Defined in: [src/screens/PluginStore/hooks/usePluginFilters.ts:16](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/screens/PluginStore/hooks/usePluginFilters.ts#L16)

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

> **filteredPlugins**: [`IPluginMeta`](plugin\types\README\interfaces\IPluginMeta.md)[]

### filterState

> **filterState**: `object`

#### filterState.option

> **option**: `string` = `'all'`

#### filterState.selectedOption

> **selectedOption**: `string`

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => [`IInstalledPlugin`](plugin\types\README\interfaces\IInstalledPlugin.md)

#### Parameters

##### pluginName

`string`

#### Returns

[`IInstalledPlugin`](plugin\types\README\interfaces\IInstalledPlugin.md)

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
