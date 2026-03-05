[**talawa-admin**](../../../README.md)

***

# Function: getRecaptchaToken()

> **getRecaptchaToken**(`siteKey`, `action`): `Promise`\<`string`\>

Defined in: [src/utils/recaptcha.ts:94](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/recaptcha.ts#L94)

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
