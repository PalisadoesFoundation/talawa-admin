[**talawa-admin**](../../../../README.md)

***

# Variable: DELETE\_ACTION\_ITEM\_CATEGORY\_MUTATION

> `const` **DELETE\_ACTION\_ITEM\_CATEGORY\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:65](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L65)

GraphQL mutation to delete an action item category.
Updated to match new backend schema using input object

## Param

MutationDeleteActionItemCategoryInput containing:
  - id: ID! - ID of the action item category to delete

 This mutation will permanently delete the category.
 Ensure the category is not associated with any action items before deletion.
