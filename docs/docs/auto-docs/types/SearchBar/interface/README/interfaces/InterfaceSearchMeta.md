[**talawa-admin**](README.md)

***

# Interface: InterfaceSearchMeta

Defined in: [src/types/SearchBar/interface.ts:11](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/SearchBar/interface.ts#L11)

Metadata about how a search was triggered.

## Properties

### event?

> `optional` **event**: `KeyboardEvent`\<`HTMLInputElement`\> \| `MouseEvent`\<`HTMLButtonElement`, `MouseEvent`\>

Defined in: [src/types/SearchBar/interface.ts:15](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/SearchBar/interface.ts#L15)

The original DOM event that triggered the search, if available

***

### trigger

> **trigger**: [`SearchBarTrigger`](types\SearchBar\type\README\type-aliases\SearchBarTrigger.md)

Defined in: [src/types/SearchBar/interface.ts:13](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/SearchBar/interface.ts#L13)

The trigger source for the search (button click, enter key, etc.)
