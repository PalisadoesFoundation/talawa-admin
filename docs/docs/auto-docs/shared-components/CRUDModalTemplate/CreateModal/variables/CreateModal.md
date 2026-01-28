[**talawa-admin**](../../../../README.md)

***

# Variable: CreateModal

> `const` **CreateModal**: `React.FC`\<[`InterfaceCreateModalProps`](../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceCreateModalProps.md)\>

Defined in: [src/shared-components/CRUDModalTemplate/CreateModal.tsx:42](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/CRUDModalTemplate/CreateModal.tsx#L42)

CreateModal Component

Specialized modal template for creating new entities.
Wraps form content with proper submission handling and loading states.

Features:
- Auto-focus on first input field when modal opens
- Keyboard shortcut: Ctrl/Cmd+Enter to submit form
- Form validation support via submitDisabled prop
- Loading state prevents duplicate submissions
- Error display with alert component

## Example

```tsx
<CreateModal
  open={showModal}
  title="Create Campaign"
  onClose={handleClose}
  onSubmit={handleCreate}
  loading={isCreating}
  error={error}
  submitDisabled={!isFormValid}
>
  <Form.Group>
    <Form.Label>Campaign Name</Form.Label>
    <Form.Control
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </Form.Group>
</CreateModal>
```
