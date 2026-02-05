[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceProfileCardProps

Defined in: [src/types/ProfileCard/interface.ts:6](https://github.com/adityai0/talawa-admin/blob/535d1f2b472009da75704def816c0977ad667d09/src/types/ProfileCard/interface.ts#L6)

ProfileCard component displays user profile information in a card format.
It includes the user's name, role, and profile image. The component also provides
navigation functionality based on the user's role and the specified portal.

## Properties

### portal?

> `optional` **portal**: `"user"` \| `"admin"`

Defined in: [src/types/ProfileCard/interface.ts:14](https://github.com/adityai0/talawa-admin/blob/535d1f2b472009da75704def816c0977ad667d09/src/types/ProfileCard/interface.ts#L14)

The portal for which the profile card is being rendered. This determines the navigation
behavior when the user clicks on the profile card. The default value is 'admin'.
- 'admin': Navigates to the admin dashboard or relevant admin pages.
- 'user': Navigates to the user dashboard or relevant user pages.

#### Default Value

```ts
'admin'
```
