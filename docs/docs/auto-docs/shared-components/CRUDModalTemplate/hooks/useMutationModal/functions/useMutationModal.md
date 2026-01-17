[Admin Docs](/)

***

# Function: useMutationModal()

> **useMutationModal**\<`TData`, `TResult`\>(`mutationFn`, `options?`): [`InterfaceUseMutationModalReturn`](../../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceUseMutationModalReturn.md)\<`TData`, `TResult`\>

Defined in: [src/shared-components/CRUDModalTemplate/hooks/useMutationModal.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/CRUDModalTemplate/hooks/useMutationModal.ts#L57)

Custom hook for modals that execute mutations (GraphQL or API calls).

Extends useFormModal with mutation execution, error handling,
and automatic state management during async operations.

## Type Parameters

### TData

`TData`

### TResult

`TResult` = `unknown`

## Parameters

### mutationFn

(`data`) => `Promise`\<`TResult`\>

Async function to execute (e.g., GraphQL mutation)

### options?

Optional callbacks for success and error handling

#### allowEmptyData?

`boolean`

#### onError?

(`error`) => `void`

#### onSuccess?

(`result`) => `void`

## Returns

[`InterfaceUseMutationModalReturn`](../../../../../types/shared-components/CRUDModalTemplate/interface/interfaces/InterfaceUseMutationModalReturn.md)\<`TData`, `TResult`\>

Object containing modal state, form data, mutation execution, and error state

## Example

```tsx
const [updateCampaign] = useMutation(UPDATE_CAMPAIGN);

const {
  isOpen,
  formData,
  openWithData,
  reset,
  execute,
  isSubmitting,
  error,
  clearError
} = useMutationModal<Campaign, UpdateCampaignResult>(
  async (data) => {
    const result = await updateCampaign({ variables: { input: data } });
    return result.data;
  },
  {
    onSuccess: () => {
      toast.success('Campaign updated!');
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  }
);

return (
  <EditModal
    open={isOpen}
    onClose={reset}
    onSubmit={(e) => { e.preventDefault(); execute(); }}
    loading={isSubmitting}
    error={error?.message}
    title="Edit Campaign"
  >
    <Form.Control defaultValue={formData?.name} />
  </EditModal>
);
```
