[**talawa-admin**](../../../../../README.md)

***

# Function: usePluginFilters()

> **usePluginFilters**(`__namedParameters`): `object`

Defined in: [src/screens/PluginStore/hooks/usePluginFilters.ts:14](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/screens/PluginStore/hooks/usePluginFilters.ts#L14)

## Parameters

### \_\_namedParameters

`UsePluginFiltersProps`

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

> **filteredPlugins**: [`IPluginMeta`](../../../../../plugin/types/interfaces/IPluginMeta.md)[]

### filterState

> **filterState**: `object`

#### filterState.option

> **option**: `string` = `'all'`

#### filterState.selectedOption

> **selectedOption**: `string`

### getInstalledPlugin()

> **getInstalledPlugin**: (`pluginName`) => `any`

#### Parameters

##### pluginName

`string`

#### Returns

`any`

### handleFilterChange()

> **handleFilterChange**: (`value`) => `void`

#### Parameters

##### value

`string`

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
