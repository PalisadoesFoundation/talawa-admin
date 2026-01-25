[**talawa-admin**](../../../README.md)

***

# Function: askAndSetRecaptcha()

> **askAndSetRecaptcha**(): `Promise`\<`void`\>

Defined in: [src/setup/setup.ts:56](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/setup/setup.ts#L56)

Prompts user to configure reCAPTCHA settings and updates the .env file.

## Returns

`Promise`\<`void`\>

`Promise<void>` - Resolves when configuration is complete.

## Remarks

This function handles the interactive setup for reCAPTCHA configuration:
- Asks whether to enable reCAPTCHA protection
- If enabled, prompts for and validates the site key
- Updates REACT_APP_USE_RECAPTCHA and REACT_APP_RECAPTCHA_SITE_KEY in .env

## Example

```typescript
await askAndSetRecaptcha();
```

## Throws

ExitPromptError - If user cancels the prompt.

## Throws

Error - If user input fails or environment update fails.
