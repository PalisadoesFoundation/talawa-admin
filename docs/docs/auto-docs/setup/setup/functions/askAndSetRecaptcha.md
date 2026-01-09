[Admin Docs](/)

***

# Function: askAndSetRecaptcha()

> **askAndSetRecaptcha**(): `Promise`\<`void`\>

Defined in: [src/setup/setup.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/setup.ts#L54)

Prompts user to configure reCAPTCHA settings and updates the .env file.

## Returns

`Promise`\<`void`\>

A promise that resolves when configuration is complete

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

ExitPromptError if user cancels the prompt

## Throws

Error if user input fails or environment update fails
