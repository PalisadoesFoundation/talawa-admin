[Admin Docs](/)

***

# Function: ViewModal()

> **ViewModal**\<`T`\>(`__namedParameters`): `Element`

Defined in: [src/shared-components/CRUDModalTemplate/ViewModal.tsx:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/ViewModal.tsx#L58)

ViewModal Component

Specialized modal template for viewing entity details in read-only mode.
No form submission, only displays data with optional custom actions.

Features:
- Read-only data display
- Loading state for data fetching
- Optional custom action buttons (e.g., Edit, Delete)
- Clean, consistent layout for viewing entities

## Type Parameters

### T

`T`

## Parameters

### \_\_namedParameters

[`InterfaceViewModalProps`](../../../../types/CRUDModalTemplate/interface/interfaces/InterfaceViewModalProps.md)\<`T`\>

## Returns

`Element`

## Examples

```tsx
<ViewModal
  open={showModal}
  title="Campaign Details"
  onClose={handleClose}
  data={campaignData}
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
  data={userData}
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
