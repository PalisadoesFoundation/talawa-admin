[**talawa-admin**](../../../README.md)

***

# Function: setupLocalStorageMock()

> **setupLocalStorageMock**(): `Storage`

Defined in: [src/test-utils/localStorageMock.ts:54](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/test-utils/localStorageMock.ts#L54)

Setup localStorage mock for tests
Configures window.localStorage with a mock implementation for test isolation

## Returns

`Storage`

Storage - The configured localStorage mock instance

## Example

```ts
// In your test file's setup:
const localStorageMock = setupLocalStorageMock();

afterEach(() => {
  localStorageMock.clear();
});

// Then in your tests:
window.localStorage.setItem('token', 'abc123');
expect(window.localStorage.getItem('token')).toBe('abc123');
```
