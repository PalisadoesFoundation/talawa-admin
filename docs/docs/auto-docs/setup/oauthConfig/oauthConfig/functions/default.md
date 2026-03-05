[Admin Docs](/)

***

# Function: default()

> **default**(): `Promise`\<`void`\>

Defined in: [src/setup/oauthConfig/oauthConfig.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/oauthConfig/oauthConfig.ts#L143)

Prompts user to configure OAuth settings and updates the .env file.

## Returns

`Promise`\<`void`\>

`Promise<void>` - Resolves when configuration is complete.

## Remarks

This function handles the interactive setup for OAuth configuration:
- Asks if user wants to set up OAuth
- If yes, asks for a base URL (default: http://localhost:4321)
- Asks which OAuth provider(s) to set up (Google, GitHub, or both)
- For each selected provider, prompts for Client ID
- Constructs redirect URIs as `{baseUrl}/auth/callback` for all providers
- Provides helpful instructions on where to obtain OAuth credentials
- Updates the corresponding VITE_*_CLIENT_ID and VITE_*_REDIRECT_URI in .env

## Example

```typescript
await askAndSetOAuth();
```

## Throws

ExitPromptError - If user cancels the prompt.

## Throws

Error - If user input fails or environment update fails.
