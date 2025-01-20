[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

<<<<<<< HEAD
Defined in: [src/components/SecuredRoute/SecuredRoute.tsx:16](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/SecuredRoute/SecuredRoute.tsx#L16)
=======
Defined in: [src/components/SecuredRoute/SecuredRoute.tsx:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/SecuredRoute/SecuredRoute.tsx#L16)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

A route guard that checks if the user is logged in and has the necessary permissions.

If the user is logged in and has an admin role set, it renders the child routes.
Otherwise, it redirects to the home page or shows a 404 page if admin role is not set.

## Returns

`Element`

The JSX element representing the secured route.
