[Admin Docs](/)

***

# Function: main()

> **main**(): `Promise`\<`void`\>

Defined in: [src/setup/setup.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/setup.ts#L158)

Main setup orchestrator for Talawa Admin initial configuration.

## Returns

`Promise`\<`void`\>

`Promise<void>` - A promise that resolves when setup completes successfully.

## Remarks

Executes the following steps in order:
1. Validates .env file existence
2. Creates backup of existing .env
3. Configures Docker options
4. Sets up port (if not using Docker) and API URL
5. Configures reCAPTCHA settings
6. Configures error logging preferences

If any step fails, exits with error code 1.
Can be cancelled with CTRL+C (exits with code 130).

## Example

```typescript
// When run directly:
// node setup.ts

// When imported for testing:
import { main } from './setup';
await main();
```

## Throws

Error - if any setup step fails.
