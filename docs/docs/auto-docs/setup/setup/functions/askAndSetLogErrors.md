[Admin Docs](/)

***

# Function: askAndSetLogErrors()

> **askAndSetLogErrors**(): `Promise`\<`void`\>

Defined in: [src/setup/setup.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/setup.ts#L115)

Prompts user to configure error logging settings and updates the .env file.

## Returns

`Promise`\<`void`\>

`Promise<void>` - Resolves when configuration is complete.

## Remarks

This function handles the interactive setup for error logging configuration:
- Asks whether to enable compile-time and runtime error logging
- Updates ALLOW_LOGS in .env based on user choice

## Example

```typescript
await askAndSetLogErrors();
```

## Throws

Error - If user input fails or environment update fails.
