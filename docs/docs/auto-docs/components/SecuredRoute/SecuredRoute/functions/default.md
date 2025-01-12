[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/SecuredRoute/SecuredRoute](../README.md) / default

# Function: default()

> **default**(): `Element`

Defined in: [src/components/SecuredRoute/SecuredRoute.tsx:16](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/components/SecuredRoute/SecuredRoute.tsx#L16)

A route guard that checks if the user is logged in and has the necessary permissions.

If the user is logged in and has an admin role set, it renders the child routes.
Otherwise, it redirects to the home page or shows a 404 page if admin role is not set.

## Returns

`Element`

The JSX element representing the secured route.
