[**talawa-admin**](../../../../README.md)

***

# Function: TestWrapper()

> **TestWrapper**(`__namedParameters`): `Element`

Defined in: [src/components/test-utils/TestWrapper.tsx:42](https://github.com/MayankJha014/talawa-admin/blob/0dd35cc200a4ed7562fa81ab87ec9b2a6facd18b/src/components/test-utils/TestWrapper.tsx#L42)

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
