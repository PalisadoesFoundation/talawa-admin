[**talawa-admin**](../../../../../README.md)

***

# Interface: IBreadcrumbsComponentProps

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:42](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/BreadcrumbsComponent/interface.ts#L42)

Props for the BreadcrumbsComponent.

## Properties

### ariaLabelTranslationKey?

> `optional` **ariaLabelTranslationKey**: `string`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:55](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/BreadcrumbsComponent/interface.ts#L55)

Optional aria-label translation key for the navigation landmark.

#### Remarks

- Key is resolved from the `common` i18n namespace.
- Defaults to `'breadcrumbs'` (i.e., `common.breadcrumbs`).

***

### items

> **items**: [`IBreadcrumbItem`](IBreadcrumbItem.md)[]

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:46](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/BreadcrumbsComponent/interface.ts#L46)

List of breadcrumb items to render.
