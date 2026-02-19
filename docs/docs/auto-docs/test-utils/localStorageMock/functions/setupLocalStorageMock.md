[Admin Docs](/)

***

# Function: setupLocalStorageMock()

> **setupLocalStorageMock**(): `Storage`

Defined in: [src/test-utils/localStorageMock.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/test-utils/localStorageMock.ts#L56)

Setup localStorage mock for tests
Configures window.localStorage with a mock implementation for test isolation

## Returns

`Storage`

Storage - The configured localStorage mock instance

## Example

// In your test file's setup:
```tsx
const localStorageMock = setupLocalStorageMock();
afterEach(() => {
  localStorageMock.clear();
});
```
// Then in your tests:
window.localStorage.setItem('token', 'abc123');
expect(window.localStorage.getItem('token')).toBe('abc123');
