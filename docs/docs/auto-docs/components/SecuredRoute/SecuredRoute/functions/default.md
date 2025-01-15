[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/SecuredRoute/SecuredRoute](../README.md) / default

# Function: default()

> **default**(): `Element`

Defined in: [src/components/SecuredRoute/SecuredRoute.tsx:16](https://github.com/gautam-divyanshu/talawa-admin/blob/2490b2ea9583ec972ca984b1d93932def1c9f92b/src/components/SecuredRoute/SecuredRoute.tsx#L16)

A route guard that checks if the user is logged in and has the necessary permissions.

If the user is logged in and has an admin role set, it renders the child routes.
Otherwise, it redirects to the home page or shows a 404 page if admin role is not set.

## Returns

`Element`

The JSX element representing the secured route.
