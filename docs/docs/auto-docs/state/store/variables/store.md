[Admin Docs](/) • **Docs**

***

# Variable: store

> `const` **store**: `EnhancedStore`\<`object`, [`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md), `Tuple`\<[`StoreEnhancer`\<`object`\>, `StoreEnhancer`]\>\>

## Type declaration

### appRoutes

> **appRoutes**: `object` = `routesReducer`

### appRoutes.components

> **components**: [`ComponentType`](../../reducers/routesReducer/type-aliases/ComponentType.md)[]

### appRoutes.targets

> **targets**: [`TargetsType`](../../reducers/routesReducer/type-aliases/TargetsType.md)[]

### plugins

> **plugins**: `any` = `pluginReducer`

### userRoutes

> **userRoutes**: `object` = `userRoutesReducer`

### userRoutes.components

> **components**: [`ComponentType`](../../reducers/userRoutesReducer/type-aliases/ComponentType.md)[]

### userRoutes.targets

> **targets**: [`TargetsType`](../../reducers/userRoutesReducer/type-aliases/TargetsType.md)[]

## Defined in

[src/state/store.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/state/store.ts#L4)
