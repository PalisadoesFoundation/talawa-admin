[Admin Docs](/)

***

# Function: useModalState()

> **useModalState**(`initialState`): [`InterfaceUseModalStateReturn`](../../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceUseModalStateReturn.md)

Defined in: [src/shared-components/CRUDModalTemplate/hooks/useModalState.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/hooks/useModalState.ts#L27)

Custom hook for managing modal open/close state.

Provides a simple API for controlling modal visibility with
open, close, and toggle functions.

## Parameters

### initialState

`boolean` = `false`

Initial open state (defaults to false)

## Returns

[`InterfaceUseModalStateReturn`](../../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceUseModalStateReturn.md)

Object containing isOpen state and control functions

## Example

```tsx
const { isOpen, open, close } = useModalState();

return (
  <>
    <Button onClick={open}>Open Modal</Button>
    <CreateModal open={isOpen} onClose={close} title="Create Item">
      <Form.Control type="text" />
    </CreateModal>
  </>
);
```
