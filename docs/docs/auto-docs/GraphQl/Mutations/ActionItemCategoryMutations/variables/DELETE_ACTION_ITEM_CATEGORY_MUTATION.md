[Admin Docs](/)

---

# Variable: DELETE_ACTION_ITEM_CATEGORY_MUTATION

> `const` **DELETE_ACTION_ITEM_CATEGORY_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L65)

GraphQL mutation to delete an action item category.
Updated to match new backend schema using input object

## Param

MutationDeleteActionItemCategoryInput containing:

- id: ID! - ID of the action item category to delete

This mutation will permanently delete the category.
Ensure the category is not associated with any action items before deletion.
