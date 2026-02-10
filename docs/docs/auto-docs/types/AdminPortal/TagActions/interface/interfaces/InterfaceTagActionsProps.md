[Admin Docs](/)

***

# Interface: InterfaceTagActionsProps

Defined in: [src/types/AdminPortal/TagActions/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L6)

## Properties

### assignToTagsFn()?

> `optional` **assignToTagsFn**: \<`TData`, `TVariables`, `TContext`, `TCache`\>(`mutation`, `options?`) => `MutationTuple`\<`TData`, `TVariables`, `TContext`, `TCache`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L13)

> Refer to the [Mutations](https://www.apollographql.com/docs/react/data/mutations/) section for a more in-depth overview of `useMutation`.

#### Type Parameters

##### TData

`TData` = `any`

##### TVariables

`TVariables` = `OperationVariables`

##### TContext

`TContext` = `DefaultContext`

##### TCache

`TCache` *extends* `ApolloCache`\<`any`\> = `ApolloCache`\<`any`\>

#### Parameters

##### mutation

A GraphQL mutation document parsed into an AST by `gql`.

`DocumentNode` | `TypedDocumentNode`\<`TData`, `TVariables`\>

##### options?

`MutationHookOptions`\<`NoInfer`\<`TData`\>, `NoInfer`\<`TVariables`\>, `TContext`, `TCache`\>

Options to control how the mutation is executed.

#### Returns

`MutationTuple`\<`TData`, `TVariables`, `TContext`, `TCache`\>

A tuple in the form of `[mutate, result]`

#### Example

```jsx
import { gql, useMutation } from '@apollo/client';

const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

function AddTodo() {
  let input;
  const [addTodo, { data }] = useMutation(ADD_TODO);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { type: input.value } });
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
```

#### Since

3.0.0

***

### availableTags

> **availableTags**: [`InterfaceTagData`](../../../../../utils/interfaces/interfaces/InterfaceTagData.md)[]

Defined in: [src/types/AdminPortal/TagActions/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L12)

***

### hideTagActionsModal()

> **hideTagActionsModal**: () => `void`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L8)

#### Returns

`void`

***

### removeFromTagsFn()?

> `optional` **removeFromTagsFn**: \<`TData`, `TVariables`, `TContext`, `TCache`\>(`mutation`, `options?`) => `MutationTuple`\<`TData`, `TVariables`, `TContext`, `TCache`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L14)

> Refer to the [Mutations](https://www.apollographql.com/docs/react/data/mutations/) section for a more in-depth overview of `useMutation`.

#### Type Parameters

##### TData

`TData` = `any`

##### TVariables

`TVariables` = `OperationVariables`

##### TContext

`TContext` = `DefaultContext`

##### TCache

`TCache` *extends* `ApolloCache`\<`any`\> = `ApolloCache`\<`any`\>

#### Parameters

##### mutation

A GraphQL mutation document parsed into an AST by `gql`.

`DocumentNode` | `TypedDocumentNode`\<`TData`, `TVariables`\>

##### options?

`MutationHookOptions`\<`NoInfer`\<`TData`\>, `NoInfer`\<`TVariables`\>, `TContext`, `TCache`\>

Options to control how the mutation is executed.

#### Returns

`MutationTuple`\<`TData`, `TVariables`, `TContext`, `TCache`\>

A tuple in the form of `[mutate, result]`

#### Example

```jsx
import { gql, useMutation } from '@apollo/client';

const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

function AddTodo() {
  let input;
  const [addTodo, { data }] = useMutation(ADD_TODO);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { type: input.value } });
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
```

#### Since

3.0.0

***

### t

> **t**: `TFunction`\<`"translation"`, `"manageTag"`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L10)

***

### tagActionsModalIsOpen

> **tagActionsModalIsOpen**: `boolean`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L7)

***

### tagActionType

> **tagActionType**: [`TagActionType`](../../../../../utils/organizationTagsUtils/type-aliases/TagActionType.md)

Defined in: [src/types/AdminPortal/TagActions/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L9)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L11)
