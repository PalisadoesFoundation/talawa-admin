[**talawa-admin**](README.md)

***

# Variable: DELETE\_ACTION\_ITEM\_CATEGORY\_MUTATION

> `const` **DELETE\_ACTION\_ITEM\_CATEGORY\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:65](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L65)

GraphQL mutation to delete an action item category.
Updated to match new backend schema using input object

## Param

MutationDeleteActionItemCategoryInput containing:
  - id: ID! - ID of the action item category to delete

 This mutation will permanently delete the category.
 Ensure the category is not associated with any action items before deletion.
