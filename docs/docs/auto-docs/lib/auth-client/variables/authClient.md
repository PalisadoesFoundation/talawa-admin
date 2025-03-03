[Admin Docs](/)

***

# Variable: authClient

> `const` **authClient**: `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object` & `object`

Defined in: [src/lib/auth-client.ts:2](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/lib/auth-client.ts#L2)

## Type declaration

### signIn

> **signIn**: `object`

#### signIn.social()

> **social**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<`NonNullable`\<\{\} \| \{\}\>, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

##### Type Parameters

• **FetchOptions** *extends* `object`

##### Parameters

###### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

##### Returns

`Promise`\<`BetterFetchResponse`\<`NonNullable`\<\{\} \| \{\}\>, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### getSession()

> **getSession**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### signOut()

> **signOut**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### signIn

> **signIn**: `object`

#### signIn.email()

> **email**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

##### Type Parameters

• **FetchOptions** *extends* `object`

##### Parameters

###### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

##### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### forgetPassword()

> **forgetPassword**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### resetPassword()

> **resetPassword**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### verifyEmail()

> **verifyEmail**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<`NonNullable`\<`void` \| \{\} \| \{\}\>, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<`NonNullable`\<`void` \| \{\} \| \{\}\>, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### sendVerificationEmail()

> **sendVerificationEmail**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### changeEmail()

> **changeEmail**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### changePassword()

> **changePassword**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### deleteUser()

> **deleteUser**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### resetPassword

> **resetPassword**: `object`

#### resetPassword.:token()

> **:token**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<`never`, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

##### Type Parameters

• **FetchOptions** *extends* `object`

##### Parameters

###### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

##### Returns

`Promise`\<`BetterFetchResponse`\<`never`, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### revokeSession()

> **revokeSession**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### revokeSessions()

> **revokeSessions**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### revokeOtherSessions()

> **revokeOtherSessions**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### linkSocial()

> **linkSocial**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### listAccounts()

> **listAccounts**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<`object`[], \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<`object`[], \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### deleteUser

> **deleteUser**: `object`

#### deleteUser.callback()

> **callback**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

##### Type Parameters

• **FetchOptions** *extends* `object`

##### Parameters

###### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

##### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### unlinkAccount()

> **unlinkAccount**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`object` & `object`\>, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### signUp

> **signUp**: `object`

#### signUp.email()

> **email**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<`NonNullable`\<\{\} \| \{\}\>, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

##### Type Parameters

• **FetchOptions** *extends* `object`

##### Parameters

###### data

...\[`Prettify`\<\{\}\>, `FetchOptions`?\]

##### Returns

`Promise`\<`BetterFetchResponse`\<`NonNullable`\<\{\} \| \{\}\>, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### updateUser()

> **updateUser**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`InferUserUpdateCtx`\<\{ `baseURL`: `string`; \}, `FetchOptions`\>\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<\{\}, \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

## Type declaration

### listSessions()

> **listSessions**: \<`FetchOptions`\>(...`data`) => `Promise`\<`BetterFetchResponse`\<`Prettify`\<\{\}\>[], \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>

#### Type Parameters

• **FetchOptions** *extends* `object`

#### Parameters

##### data

...\[`Prettify`\<`undefined`\>?, `FetchOptions`?\]

#### Returns

`Promise`\<`BetterFetchResponse`\<`Prettify`\<\{\}\>[], \{\}, `FetchOptions`\[`"throw"`\] *extends* `true` ? `true` : `false`\>\>
