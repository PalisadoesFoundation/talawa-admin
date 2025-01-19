[Admin Docs](/)

***

# Function: useAppDispatch()

> **useAppDispatch**\<`AppDispatch`\>(): `AppDispatch`

Defined in: [src/state/hooks.ts:5](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/state/hooks.ts#L5)

Returns the dispatch function from the Redux store.

## Type Parameters

• **AppDispatch** *extends* `ThunkDispatch`\<\{ `appRoutes`: \{ `components`: [`ComponentType`](../../reducers/routesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/routesReducer/type-aliases/TargetsType.md)[]; \}; `plugins`: `any`; `userRoutes`: \{ `components`: [`ComponentType`](../../reducers/userRoutesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/userRoutesReducer/type-aliases/TargetsType.md)[]; \}; \}, `undefined`, `UnknownAction`\> & `Dispatch`\<[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)\> = `ThunkDispatch`\<\{ `appRoutes`: \{ `components`: [`ComponentType`](../../reducers/routesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/routesReducer/type-aliases/TargetsType.md)[]; \}; `plugins`: `any`; `userRoutes`: \{ `components`: [`ComponentType`](../../reducers/userRoutesReducer/type-aliases/ComponentType.md)[]; `targets`: [`TargetsType`](../../reducers/userRoutesReducer/type-aliases/TargetsType.md)[]; \}; \}, `undefined`, `UnknownAction`\> & `Dispatch`\<[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)\>

The specific type of the dispatch function.

## Returns

`AppDispatch`

The dispatch function from the Redux store.
