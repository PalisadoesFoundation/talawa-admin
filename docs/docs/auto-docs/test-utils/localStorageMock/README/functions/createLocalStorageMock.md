[**talawa-admin**](README.md)

***

# Function: createLocalStorageMock()

> **createLocalStorageMock**(): `Storage`

Defined in: [src/test-utils/localStorageMock.ts:12](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/test-utils/localStorageMock.ts#L12)

Creates an in-memory localStorage mock for test isolation
Prevents tests from interfering with each other or real browser storage

## Returns

`Storage`

Storage - Mock implementation of the Storage interface

## Example

```ts
const mockStorage = createLocalStorageMock();
mockStorage.setItem('key', 'value');
expect(mockStorage.getItem('key')).toBe('value');
mockStorage.clear();
```
