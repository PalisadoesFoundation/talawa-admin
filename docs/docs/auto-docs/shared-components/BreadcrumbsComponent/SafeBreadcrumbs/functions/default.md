[**talawa-admin**](../../../../README.md)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/shared-components/BreadcrumbsComponent/SafeBreadcrumbs.tsx:19](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/BreadcrumbsComponent/SafeBreadcrumbs.tsx#L19)

SafeBreadcrumbs is a defensive wrapper around [BreadcrumbsComponent](../../functions/BreadcrumbsComponent.md).

It ensures breadcrumbs are only rendered when the component is mounted
within a valid React Router context. When rendered outside of a router,
the component safely returns `null` to prevent runtime errors.

In non-production environments, a warning is logged to aid debugging
and improve developer experience.

## Parameters

### props

[`IBreadcrumbsComponentProps`](../../../../types/shared-components/BreadcrumbsComponent/interface/interfaces/IBreadcrumbsComponentProps.md)

Props forwarded to [BreadcrumbsComponent](../../functions/BreadcrumbsComponent.md).

## Returns

`Element`

A breadcrumb trail when inside a router context, otherwise `null`.
