[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceSearchMeta

Defined in: [src/types/SearchBar/interface.ts:11](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SearchBar/interface.ts#L11)

Metadata about how a search was triggered.

## Properties

### event?

> `optional` **event**: `KeyboardEvent`\<`HTMLInputElement`\> \| `MouseEvent`\<`HTMLButtonElement`, `MouseEvent`\>

Defined in: [src/types/SearchBar/interface.ts:15](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SearchBar/interface.ts#L15)

The original DOM event that triggered the search, if available

***

### trigger

> **trigger**: [`SearchBarTrigger`](../../type/type-aliases/SearchBarTrigger.md)

Defined in: [src/types/SearchBar/interface.ts:13](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/SearchBar/interface.ts#L13)

The trigger source for the search (button click, enter key, etc.)
