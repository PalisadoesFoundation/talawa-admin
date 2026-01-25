[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceSortingOption

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:14](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/SearchFilterBar/interface.ts#L14)

Represents a single option in a sorting or filtering dropdown.
This interface is compatible with the SortingButton component's option format.

## Properties

### label

> **label**: `string`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:19](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/SearchFilterBar/interface.ts#L19)

The display text shown to the user in the dropdown menu.

#### Example

```ts
"Latest", "Oldest", "Most Hours"
```

***

### value

> **value**: `string` \| `number`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:26](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/SearchFilterBar/interface.ts#L26)

The underlying value associated with this option.
This value is passed to the onOptionChange callback when the option is selected.

#### Example

```ts
"DESCENDING", "hours_DESC", "all", 0, 1, 2
```
