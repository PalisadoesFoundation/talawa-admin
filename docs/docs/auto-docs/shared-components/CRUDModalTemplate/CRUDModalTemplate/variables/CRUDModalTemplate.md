[Admin Docs](/)

***

# Variable: CRUDModalTemplate

> `const` **CRUDModalTemplate**: `React.FC`\<[`InterfaceCRUDModalTemplateProps`](../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceCRUDModalTemplateProps.md)\>

Defined in: [src/shared-components/CRUDModalTemplate/CRUDModalTemplate.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/CRUDModalTemplate.tsx#L43)

Base CRUD Modal Template Component

A reusable modal component that provides consistent structure, styling,
and behavior for all CRUD operations. This component serves as the foundation
for specialized modal templates (Create, Edit, Delete, View).

Features:
- Consistent modal structure and styling
- Loading state management with spinner overlay
- Error display with alert component
- Customizable footer with action buttons
- Keyboard shortcuts (Escape to close)
- Accessible with proper ARIA attributes
- Prevents modal close during loading operations

## Example

```tsx
<CRUDModalTemplate
  open={isOpen}
  title="Edit User"
  onClose={handleClose}
  onPrimary={handleSave}
  loading={isSaving}
  error={errorMessage}
>
  <Form.Group>
    <Form.Label>Name</Form.Label>
    <Form.Control value={name} onChange={e => setName(e.target.value)} />
  </Form.Group>
</CRUDModalTemplate>
```
