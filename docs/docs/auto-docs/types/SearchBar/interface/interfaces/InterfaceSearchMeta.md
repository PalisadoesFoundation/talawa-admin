[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceSearchMeta

Defined in: [src/types/SearchBar/interface.ts:11](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/SearchBar/interface.ts#L11)

Metadata about how a search was triggered.

## Properties

### event?

> `optional` **event**: `KeyboardEvent`\<`HTMLInputElement`\> \| `MouseEvent`\<`HTMLButtonElement`, `MouseEvent`\>

Defined in: [src/types/SearchBar/interface.ts:15](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/SearchBar/interface.ts#L15)

The original DOM event that triggered the search, if available

***

### trigger

> **trigger**: [`SearchBarTrigger`](../../type/type-aliases/SearchBarTrigger.md)

Defined in: [src/types/SearchBar/interface.ts:13](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/SearchBar/interface.ts#L13)

The trigger source for the search (button click, enter key, etc.)
