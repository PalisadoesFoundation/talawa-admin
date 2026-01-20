[Admin Docs](/)

***

# Function: useRegistration()

> **useRegistration**(`__namedParameters`): `object`

Defined in: [src/hooks/auth/useRegistration.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useRegistration.ts#L17)

Custom hook for user registration

## Parameters

### \_\_namedParameters

`IUseRegistrationProps`

## Returns

`object`

### loading

> **loading**: `boolean`

### register()

> **register**: (`data`) => `Promise`\<`void`\>

#### Parameters

##### data

###### email

`string`

###### name

`string`

###### organizationId

`string`

###### password

`string`

###### recaptchaToken?

`string`

#### Returns

`Promise`\<`void`\>
