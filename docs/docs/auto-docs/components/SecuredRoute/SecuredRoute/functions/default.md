[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/components/SecuredRoute/SecuredRoute.tsx:16](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/components/SecuredRoute/SecuredRoute.tsx#L16)

A route guard that checks if the user is logged in and has the necessary permissions.

If the user is logged in and has an admin role set, it renders the child routes.
Otherwise, it redirects to the home page or shows a 404 page if admin role is not set.

## Returns

`Element`

The JSX element representing the secured route.
