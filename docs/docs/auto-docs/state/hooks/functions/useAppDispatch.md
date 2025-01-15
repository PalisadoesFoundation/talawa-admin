[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [state/hooks](../README.md) / useAppDispatch

# Function: useAppDispatch()

> **useAppDispatch**\<`AppDispatch`\>(): `AppDispatch`

Defined in: [src/state/hooks.ts:5](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/state/hooks.ts#L5)

Returns the dispatch function from the Redux store.

## Type Parameters

• **AppDispatch** *extends* `ThunkDispatch`\<\{ `appRoutes`: \{ `components`: [`ComponentType`](../../reducers/routesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/routesReducer/type-aliases/TargetsType.md)[]; \}; `plugins`: `any`; `userRoutes`: \{ `components`: [`ComponentType`](../../reducers/userRoutesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/userRoutesReducer/type-aliases/TargetsType.md)[]; \}; \}, `undefined`, `UnknownAction`\> & `Dispatch`\<[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)\> = `ThunkDispatch`\<\{ `appRoutes`: \{ `components`: [`ComponentType`](../../reducers/routesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/routesReducer/type-aliases/TargetsType.md)[]; \}; `plugins`: `any`; `userRoutes`: \{ `components`: [`ComponentType`](../../reducers/userRoutesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/userRoutesReducer/type-aliases/TargetsType.md)[]; \}; \}, `undefined`, `UnknownAction`\> & `Dispatch`\<[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)\>

The specific type of the dispatch function.

## Returns

`AppDispatch`

The dispatch function from the Redux store.
