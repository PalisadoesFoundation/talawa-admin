[Admin Docs](/)

***

# Interface: IBreadcrumbsComponentProps

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L41)

Props for the BreadcrumbsComponent.

## Properties

### ariaLabelTranslationKey?

> `optional` **ariaLabelTranslationKey**: `string`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L54)

Optional aria-label translation key for the navigation landmark.

#### Remarks

- Key is resolved from the `common` i18n namespace.
- Defaults to `'breadcrumbs'` (i.e., `common.breadcrumbs`).

***

### items

> **items**: [`IBreadcrumbItem`](IBreadcrumbItem.md)[]

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L45)

List of breadcrumb items to render.
