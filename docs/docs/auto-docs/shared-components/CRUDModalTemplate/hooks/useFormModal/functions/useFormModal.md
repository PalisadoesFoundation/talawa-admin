[Admin Docs](/)

***

# Function: useFormModal()

> **useFormModal**\<`T`\>(`initialData`): [`InterfaceUseFormModalReturn`](../../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceUseFormModalReturn.md)\<`T`\>

Defined in: [src/shared-components/CRUDModalTemplate/hooks/useFormModal.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/hooks/useFormModal.ts#L50)

Custom hook combining modal state with form data handling.

Extends useModalState with form data management, useful for
edit modals where you need to open the modal with pre-populated data.

## Type Parameters

### T

`T`

## Parameters

### initialData

`T` = `null`

Initial form data (defaults to null)

## Returns

[`InterfaceUseFormModalReturn`](../../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceUseFormModalReturn.md)\<`T`\>

Object containing modal state, form data, and control functions

## Example

```tsx
const {
  isOpen,
  close,
  formData,
  openWithData,
  reset,
  isSubmitting,
  setIsSubmitting
} = useFormModal<Campaign>();

const handleEdit = (campaign: Campaign) => {
  openWithData(campaign);
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  await updateCampaign(formData);
  setIsSubmitting(false);
  reset();
};

return (
  <EditModal
    open={isOpen}
    onClose={reset}
    onSubmit={handleSubmit}
    loading={isSubmitting}
    title="Edit Campaign"
  >
    <Form.Control defaultValue={formData?.name} />
  </EditModal>
);
```
