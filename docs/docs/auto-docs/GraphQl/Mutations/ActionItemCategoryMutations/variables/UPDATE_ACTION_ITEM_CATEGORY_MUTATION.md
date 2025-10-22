[Admin Docs](/)

---

# Variable: UPDATE_ACTION_ITEM_CATEGORY_MUTATION

> `const` **UPDATE_ACTION_ITEM_CATEGORY_MUTATION**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/ActionItemCategoryMutations.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/ActionItemCategoryMutations.ts#L41)

GraphQL mutation to update an action item category.

## Param

MutationUpdateActionItemCategoryInput containing:

- id: ID! - ID of the action item category to update
- name: String - New name of the action item category (optional)
- isDisabled: Boolean - Whether the category should be disabled (optional)
