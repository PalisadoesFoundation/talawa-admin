[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/SecuredRoute/SecuredRoute](../README.md) / default

# Function: default()

> **default**(): `Element`

Defined in: [src/components/SecuredRoute/SecuredRoute.tsx:16](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/components/SecuredRoute/SecuredRoute.tsx#L16)

A route guard that checks if the user is logged in and has the necessary permissions.

If the user is logged in and has an admin role set, it renders the child routes.
Otherwise, it redirects to the home page or shows a 404 page if admin role is not set.

## Returns

`Element`

The JSX element representing the secured route.
