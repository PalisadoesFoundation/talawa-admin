[**talawa-admin**](../../../../README.md)

***

# Variable: DeleteModal

> `const` **DeleteModal**: `React.FC`\<[`InterfaceDeleteModalProps`](../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceDeleteModalProps.md)\>

Defined in: [src/shared-components/CRUDModalTemplate/DeleteModal.tsx:63](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/shared-components/CRUDModalTemplate/DeleteModal.tsx#L63)

DeleteModal Component

Specialized modal template for delete confirmations.
Displays warning UI and handles delete operations.

Features:
- Warning icon for visual emphasis
- Highlighted entity name in confirmation message
- Support for recurring event deletion patterns
- Danger-styled delete button
- Loading state prevents duplicate delete requests

## Examples

```tsx
<DeleteModal
  open={showModal}
  title="Delete Campaign"
  onClose={handleClose}
  onDelete={handleDelete}
  loading={isDeleting}
  entityName="Summer Campaign 2024"
  confirmationMessage="Are you sure you want to delete this campaign?"
/>
```

```tsx
<DeleteModal
  open={showModal}
  title="Delete Recurring Event"
  onClose={handleClose}
  onDelete={handleDelete}
  loading={isDeleting}
  entityName="Weekly Meeting"
  recurringEventContent={
    <Form.Group>
      <Form.Check
        type="radio"
        label="Delete this instance only"
        checked={deleteMode === 'instance'}
        onChange={() => setDeleteMode('instance')}
      />
      <Form.Check
        type="radio"
        label="Delete all future instances"
        checked={deleteMode === 'series'}
        onChange={() => setDeleteMode('series')}
      />
    </Form.Group>
  }
/>
```
