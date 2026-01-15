[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceSearchMeta

Defined in: [src/types/SearchBar/interface.ts:11](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/SearchBar/interface.ts#L11)

Metadata about how a search was triggered.

## Properties

### event?

> `optional` **event**: `KeyboardEvent`\<`HTMLInputElement`\> \| `MouseEvent`\<`HTMLButtonElement`, `MouseEvent`\>

Defined in: [src/types/SearchBar/interface.ts:15](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/SearchBar/interface.ts#L15)

The original DOM event that triggered the search, if available

***

### trigger

> **trigger**: [`SearchBarTrigger`](../../type/type-aliases/SearchBarTrigger.md)

Defined in: [src/types/SearchBar/interface.ts:13](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/SearchBar/interface.ts#L13)

The trigger source for the search (button click, enter key, etc.)
