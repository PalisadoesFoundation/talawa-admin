[Admin Docs](/)

***

# Function: TestWrapper()

> **TestWrapper**(`__namedParameters`): `Element`

<<<<<<< HEAD
Defined in: [src/components/test-utils/TestWrapper.tsx:42](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/test-utils/TestWrapper.tsx#L42)
=======
Defined in: [src/components/test-utils/TestWrapper.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/test-utils/TestWrapper.tsx#L42)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

A wrapper component for testing React components that require Apollo Client, i18n, and Router contexts.
Provides the necessary provider context for testing components that use GraphQL, translations, and routing.

## Parameters

### \_\_namedParameters

`InterfaceTestWrapperProps`

## Returns

`Element`

A JSX element with all required providers wrapped around the children

## Example

```tsx
const mocks = [{
  request: { query: TEST_QUERY },
  result: { data: { test: 'data' } }
}];

render(
  <TestWrapper mocks={mocks}>
    <ComponentToTest />
  </TestWrapper>
);
```
