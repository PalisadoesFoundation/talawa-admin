[Admin Docs](/)

***

# Function: reducers()

> **reducers**(`state`, `action`): `object`

Defined in: [src/state/reducers/index.ts:6](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/state/reducers/index.ts#L6)

## Parameters

### state

\{ `appRoutes`: \{ `components`: [`ComponentType`](../routesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../routesReducer/type-aliases/TargetsType.md)[]; \}; `plugins`: `any`; `userRoutes`: \{ `components`: [`ComponentType`](../userRoutesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../userRoutesReducer/type-aliases/TargetsType.md)[]; \}; \} | `Partial`\<\{ `appRoutes`: `never`; `plugins`: `never`; `userRoutes`: `never`; \}\>

### action

[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)

## Returns

`object`

### appRoutes

> **appRoutes**: `object` = `routesReducer`

#### appRoutes.components

> **components**: [`ComponentType`](../routesReducer/type-aliases/ComponentType.md)[]

#### appRoutes.targets

> **targets**: [`TargetsType`](../routesReducer/type-aliases/TargetsType.md)[]

### plugins

> **plugins**: `any` = `pluginReducer`

### userRoutes

> **userRoutes**: `object` = `userRoutesReducer`

#### userRoutes.components

> **components**: [`ComponentType`](../userRoutesReducer/type-aliases/ComponentType.md)[]

#### userRoutes.targets

> **targets**: [`TargetsType`](../userRoutesReducer/type-aliases/TargetsType.md)[]
