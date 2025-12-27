[**talawa-admin**](README.md)

***

# Variable: CREATE\_ACTION\_ITEM\_CATEGORY\_MUTATION

> `const` **CREATE\_ACTION\_ITEM\_CATEGORY\_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:11](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L11)

GraphQL mutation to create an action item category.

## Param

MutationCreateActionItemCategoryInput containing:
  - name: String! - Name of the action item category
  - isDisabled: Boolean - Whether the category is disabled (optional, defaults to false)
  - organizationId: ID! - ID of the organization this category belongs to
