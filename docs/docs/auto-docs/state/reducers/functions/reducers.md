[Admin Docs](/) • **Docs**

***

# Function: reducers()

> **reducers**(`state`, `action`): `object`

## Parameters

• **state**: `object` \| `Partial`\<`object`\>

• **action**: [`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)

## Returns

`object`

### appRoutes

> **appRoutes**: `object` = `routesReducer`

### appRoutes.components

> **components**: [`ComponentType`](../routesReducer/type-aliases/ComponentType.md)[]

### appRoutes.targets

> **targets**: [`TargetsType`](../routesReducer/type-aliases/TargetsType.md)[]

### plugins

> **plugins**: `any` = `pluginReducer`

### userRoutes

> **userRoutes**: `object` = `userRoutesReducer`

### userRoutes.components

> **components**: [`ComponentType`](../userRoutesReducer/type-aliases/ComponentType.md)[]

### userRoutes.targets

> **targets**: [`TargetsType`](../userRoutesReducer/type-aliases/TargetsType.md)[]

## Defined in

[src/state/reducers/index.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/state/reducers/index.ts#L6)
