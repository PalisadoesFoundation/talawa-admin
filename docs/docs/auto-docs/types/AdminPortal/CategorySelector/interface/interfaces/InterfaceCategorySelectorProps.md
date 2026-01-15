[Admin Docs](/)

***

# Interface: InterfaceCategorySelectorProps

Defined in: [src/types/AdminPortal/CategorySelector/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CategorySelector/interface.ts#L6)

Props for CategorySelector component.

## Properties

### categories

> **categories**: [`IActionItemCategoryInfo`](../../../../shared-components/ActionItems/interface/interfaces/IActionItemCategoryInfo.md)[]

Defined in: [src/types/AdminPortal/CategorySelector/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CategorySelector/interface.ts#L8)

List of available action item categories

***

### onCategoryChange()

> **onCategoryChange**: (`category`) => `void`

Defined in: [src/types/AdminPortal/CategorySelector/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CategorySelector/interface.ts#L12)

Callback fired when user selects a different category

#### Parameters

##### category

[`IActionItemCategoryInfo`](../../../../shared-components/ActionItems/interface/interfaces/IActionItemCategoryInfo.md)

#### Returns

`void`

***

### selectedCategory

> **selectedCategory**: [`IActionItemCategoryInfo`](../../../../shared-components/ActionItems/interface/interfaces/IActionItemCategoryInfo.md)

Defined in: [src/types/AdminPortal/CategorySelector/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/CategorySelector/interface.ts#L10)

Currently selected category (null if none selected)
