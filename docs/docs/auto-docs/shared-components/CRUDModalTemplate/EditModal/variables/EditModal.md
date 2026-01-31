[Admin Docs](/)

***

# Variable: EditModal

> `const` **EditModal**: `React.FC`\<[`InterfaceEditModalProps`](../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceEditModalProps.md)\>

Defined in: [src/shared-components/CRUDModalTemplate/EditModal.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/EditModal.tsx#L43)

EditModal Component

Specialized modal template for editing existing entities.
Supports data loading states and pre-population of form fields.

Features:
- Auto-focus on first input field when modal opens and data is loaded
- Keyboard shortcut: Ctrl/Cmd+Enter to submit form
- Loading state for data fetching (loadingData prop)
- Form validation support via submitDisabled prop
- Prevents duplicate submissions during save

## Example

```tsx
<EditModal
  open={showModal}
  title="Edit Campaign"
  onClose={handleClose}
  onSubmit={handleUpdate}
  loading={isSaving}
  loadingData={isLoadingData}
  error={error}
  submitDisabled={!isFormDirty}
>
  <Form.Group>
    <Form.Label>Campaign Name</Form.Label>
    <Form.Control
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </Form.Group>
</EditModal>
```
