[Admin Docs](/)

***

# Variable: ViewModal

> `const` **ViewModal**: `React.FC`\<[`InterfaceViewModalProps`](../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceViewModalProps.md)\>

Defined in: [src/shared-components/CRUDModalTemplate/ViewModal.tsx:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/ViewModal.tsx#L56)

ViewModal Component

Specialized modal template for viewing entity details in read-only mode.
No form submission, only displays data with optional custom actions.
Parent component handles data fetching and passes formatted content as children.

Features:
- Read-only data display
- Loading state for data fetching
- Optional custom action buttons (e.g., Edit, Delete)
- Clean, consistent layout for viewing entities

## Examples

```tsx
<ViewModal
  open={showModal}
  title="Campaign Details"
  onClose={handleClose}
  loadingData={isLoading}
>
  <div className="details-grid">
    <div>
      <strong>Name:</strong> {campaignData?.name}
    </div>
    <div>
      <strong>Start Date:</strong> {formatDate(campaignData?.startDate)}
    </div>
  </div>
</ViewModal>
```

```tsx
<ViewModal
  open={showModal}
  title="User Profile"
  onClose={handleClose}
  customActions={
    <>
      <Button onClick={() => setEditMode(true)}>Edit</Button>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </>
  }
>
  <UserProfile user={userData} />
</ViewModal>
```
