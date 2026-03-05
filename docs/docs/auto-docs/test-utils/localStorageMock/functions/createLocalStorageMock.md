[**talawa-admin**](../../../README.md)

***

# Function: createLocalStorageMock()

> **createLocalStorageMock**(): `Storage`

Defined in: [src/test-utils/localStorageMock.ts:14](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/test-utils/localStorageMock.ts#L14)

Creates an in-memory localStorage mock for test isolation
Prevents tests from interfering with each other or real browser storage

## Returns

`Storage`

Storage - Mock implementation of the Storage interface

## Example

```tsx
const mockStorage = createLocalStorageMock();
mockStorage.setItem('key', 'value');
expect(mockStorage.getItem('key')).toBe('value');
mockStorage.clear();
```
