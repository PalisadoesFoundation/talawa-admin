[Admin Docs](/)

***

# Interface: IBreadcrumbsComponentProps

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L42)

Props for the BreadcrumbsComponent.

## Properties

### ariaLabelTranslationKey?

> `optional` **ariaLabelTranslationKey**: `string`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L55)

Optional aria-label translation key for the navigation landmark.

#### Remarks

- Key is resolved from the `common` i18n namespace.
- Defaults to `'breadcrumbs'` (i.e., `common.breadcrumbs`).

***

### items

> **items**: [`IBreadcrumbItem`](IBreadcrumbItem.md)[]

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L46)

List of breadcrumb items to render.
