[**talawa-admin**](README.md)

***

# Interface: InterfaceUserAddressFieldsProps

Defined in: [src/types/UserPortal/UserProfile/interface.ts:72](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/UserPortal/UserProfile/interface.ts#L72)

Props for the UserAddressFields component.

## Properties

### handleFieldChange()

> **handleFieldChange**: (`field`, `value`) => `void`

Defined in: [src/types/UserPortal/UserProfile/interface.ts:74](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/UserPortal/UserProfile/interface.ts#L74)

A function to handle changes to address fields.

#### Parameters

##### field

`string`

##### value

`string`

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/UserPortal/UserProfile/interface.ts:73](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/UserPortal/UserProfile/interface.ts#L73)

A translation function that accepts a key and returns the corresponding localized string.

#### Parameters

##### key

`string`

#### Returns

`string`

***

### userDetails

> **userDetails**: `object`

Defined in: [src/types/UserPortal/UserProfile/interface.ts:75](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/UserPortal/UserProfile/interface.ts#L75)

The address details of the user.

#### addressLine1

> **addressLine1**: `string`

#### addressLine2

> **addressLine2**: `string`

#### city

> **city**: `string`

#### countryCode

> **countryCode**: `string`

#### postalCode

> **postalCode**: `string`

#### state

> **state**: `string`
