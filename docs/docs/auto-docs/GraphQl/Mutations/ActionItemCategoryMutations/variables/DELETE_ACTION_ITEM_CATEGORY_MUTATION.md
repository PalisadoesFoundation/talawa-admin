[**talawa-admin**](../../../../README.md)

***

# Variable: DELETE\_ACTION\_ITEM\_CATEGORY\_MUTATION

> `const` **DELETE\_ACTION\_ITEM\_CATEGORY\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:65](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L65)

GraphQL mutation to delete an action item category.
Updated to match new backend schema using input object

## Param

MutationDeleteActionItemCategoryInput containing:
  - id: ID! - ID of the action item category to delete

 This mutation will permanently delete the category.
 Ensure the category is not associated with any action items before deletion.
