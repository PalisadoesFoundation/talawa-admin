[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceSortingOption

Defined in: [src/types/AdminSearchFilterBar/interface.ts:15](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/AdminSearchFilterBar/interface.ts#L15)

Represents a single option in a sorting or filtering dropdown.
This interface is compatible with the SortingButton component's option format.

## Properties

### label

> **label**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:20](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/AdminSearchFilterBar/interface.ts#L20)

The display text shown to the user in the dropdown menu.

#### Example

```ts
"Latest", "Oldest", "Most Hours"
```

***

### value

> **value**: `string` \| `number`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:27](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/AdminSearchFilterBar/interface.ts#L27)

The underlying value associated with this option.
This value is passed to the onOptionChange callback when the option is selected.

#### Example

```ts
"DESCENDING", "hours_DESC", "all", 0, 1, 2
```
