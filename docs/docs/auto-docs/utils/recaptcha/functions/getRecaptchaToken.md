[Admin Docs](/)

***

# Function: getRecaptchaToken()

> **getRecaptchaToken**(`siteKey`, `action`): `Promise`\<`string`\>

Defined in: [src/utils/recaptcha.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/recaptcha.ts#L76)

Get a reCAPTCHA token for the specified action

## Parameters

### siteKey

`string`

The reCAPTCHA site key

### action

`string`

The action name for this reCAPTCHA request

## Returns

`Promise`\<`string`\>

Promise that resolves to the reCAPTCHA token
