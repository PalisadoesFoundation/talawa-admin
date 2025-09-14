[Admin Docs](/)

***

# Function: usePluginFilters()

> **usePluginFilters**(`__namedParameters`): `object`

Defined in: [src/screens/PluginStore/hooks/usePluginFilters.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/PluginStore/hooks/usePluginFilters.ts#L27)

## Parameters

### \_\_namedParameters

`UsePluginFiltersProps`

## Returns

`object`

### debouncedSearch()

> **debouncedSearch**: (`value`) => `void`

#### Parameters

##### value

`string`

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
