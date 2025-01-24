[Admin Docs](/) • **Docs**

***

# Function: useAppDispatch()

> **useAppDispatch**\<`AppDispatch`\>(): `AppDispatch`

Returns the dispatch function from the Redux store.

## Type Parameters

• **AppDispatch** *extends* `ThunkDispatch`\<`object`, `undefined`, `UnknownAction`\> & `Dispatch`\<[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)\> = `ThunkDispatch`\<`object`, `undefined`, `UnknownAction`\> & `Dispatch`\<[`InterfaceAction`](../../helpers/Action/interfaces/InterfaceAction.md)\>

The specific type of the dispatch function.

## Returns

`AppDispatch`

The dispatch function from the Redux store.

## Defined in

[src/state/hooks.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/state/hooks.ts#L5)
