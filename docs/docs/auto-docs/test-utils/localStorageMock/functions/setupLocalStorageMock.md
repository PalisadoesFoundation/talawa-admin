[Admin Docs](/)

***

# Function: setupLocalStorageMock()

> **setupLocalStorageMock**(): `Storage`

Defined in: [src/test-utils/localStorageMock.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/test-utils/localStorageMock.ts#L53)

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
