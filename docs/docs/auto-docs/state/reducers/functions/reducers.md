[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../modules.md) / [state/reducers](../README.md) / reducers

# Function: reducers()

> **reducers**(`state`, `action`): `object`

Defined in: [src/state/reducers/index.ts:6](https://github.com/bint-Eve/talawa-admin/blob/e05e1a03180dbbfc7ba850102958ea6b6cd4b01e/src/state/reducers/index.ts#L6)

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
