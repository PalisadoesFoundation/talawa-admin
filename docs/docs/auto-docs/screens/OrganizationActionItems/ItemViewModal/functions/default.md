[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/OrganizationActionItems/ItemViewModal.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ItemViewModal.tsx#L32)

A modal dialog for viewing action item details.

## Parameters

### props

[`InterfaceViewModalProps`](../interfaces/InterfaceViewModalProps.md)

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

The rendered modal component.

The `ItemViewModal` component displays all the fields of an action item in a modal dialog.
It includes fields for assignee, assigner, category, pre and post completion notes, assignment date, due date, completion date, and event.
