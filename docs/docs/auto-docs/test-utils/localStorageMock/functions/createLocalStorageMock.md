[**talawa-admin**](../../../README.md)

***

# Function: createLocalStorageMock()

> **createLocalStorageMock**(): `Storage`

Defined in: [src/test-utils/localStorageMock.ts:12](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/test-utils/localStorageMock.ts#L12)

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
