[Admin Docs](/)

***

# Function: askAndSetRecaptcha()

> **askAndSetRecaptcha**(): `Promise`\<`void`\>

Defined in: [src/setup/setup.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/setup.ts#L48)

Prompts user to configure reCAPTCHA settings and updates .env file.

Asks whether to enable reCAPTCHA and, if yes, validates and stores the site key.
Updates REACT_APP_USE_RECAPTCHA and REACT_APP_RECAPTCHA_SITE_KEY in .env.

## Returns

`Promise`\<`void`\>

{Promise<void>}

## Throws

{Error} If user input fails or environment update fails

## Example

```ts
await askAndSetRecaptcha();
```
