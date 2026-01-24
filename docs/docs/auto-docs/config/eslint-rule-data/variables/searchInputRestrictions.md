[Admin Docs](/)

***

# Variable: searchInputRestrictions

> `const` **searchInputRestrictions**: `object`[]

Defined in: [src/config/eslint-rule-data.ts:181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/config/eslint-rule-data.ts#L181)

Search input restrictions - disabled for search component implementations

## Type Declaration

### message

> **message**: `string` = `'Direct <input type="search"> is not allowed. Use SearchBar or SearchFilterBar components instead.'`

### selector

> **selector**: `string` = `"JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='type'] > Literal[value='search']"`
