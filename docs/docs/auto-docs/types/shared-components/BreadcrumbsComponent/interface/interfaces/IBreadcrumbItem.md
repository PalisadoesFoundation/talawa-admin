[Admin Docs](/)

***

# Interface: IBreadcrumbItem

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L7)

Interface for individual breadcrumb items.

Supports i18n via translation keys, optional navigation,
and current page marking for accessibility.

## Properties

### isCurrent?

> `optional` **isCurrent**: `boolean`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L36)

Marks the breadcrumb as the current page.

#### Remarks

- This flag is optional and evaluated at runtime by the BreadcrumbsComponent.
- If omitted, the component treats the last breadcrumb item as current by convention.
- If multiple items are marked `isCurrent: true`, the first encountered
  item will be rendered as the active breadcrumb.

Applies `aria-current="page"` for accessibility.

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L17)

Fallback label when no translation key is provided.

***

### to?

> `optional` **to**: `string`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L23)

Navigation path for React Router `Link`.
If omitted, breadcrumb is rendered as plain text.

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/shared-components/BreadcrumbsComponent/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BreadcrumbsComponent/interface.ts#L12)

i18n translation key for the breadcrumb label.
Takes precedence over `label` if provided.
