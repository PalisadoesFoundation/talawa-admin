[**talawa-admin**](../../../../README.md)

***

# Variable: CREATE\_ACTION\_ITEM\_CATEGORY\_MUTATION

> `const` **CREATE\_ACTION\_ITEM\_CATEGORY\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:11](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L11)

GraphQL mutation to create an action item category.

## Param

MutationCreateActionItemCategoryInput containing:
  - name: String! - Name of the action item category
  - isDisabled: Boolean - Whether the category is disabled (optional, defaults to false)
  - organizationId: ID! - ID of the organization this category belongs to
