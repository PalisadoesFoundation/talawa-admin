[Admin Docs](/)

***

# Function: reducers()

> **reducers**(`state`, `action`): `object`

Defined in: [src/state/reducers/index.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/state/reducers/index.ts#L5)

## Parameters

### state

\{ `appRoutes`: \{ `components`: [`ComponentType`](../routesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../routesReducer/type-aliases/TargetsType.md)[]; \}; `userRoutes`: \{ `components`: [`ComponentType`](../userRoutesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../userRoutesReducer/type-aliases/TargetsType.md)[]; \}; \} | `Partial`\<\{ `appRoutes`: `never`; `userRoutes`: `never`; \}\>

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

### userRoutes

> **userRoutes**: `object` = `userRoutesReducer`

#### userRoutes.components

> **components**: [`ComponentType`](../userRoutesReducer/type-aliases/ComponentType.md)[]

#### userRoutes.targets

> **targets**: [`TargetsType`](../userRoutesReducer/type-aliases/TargetsType.md)[]
