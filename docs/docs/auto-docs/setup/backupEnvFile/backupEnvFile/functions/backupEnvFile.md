[**talawa-admin**](../../../../README.md)

***

# Function: backupEnvFile()

> **backupEnvFile**(): `Promise`\<`string`\>

Defined in: [src/setup/backupEnvFile/backupEnvFile.ts:13](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/setup/backupEnvFile/backupEnvFile.ts#L13)

Prompts the user to back up the current .env file before setup modifications.
Creates a timestamped backup in the .backup directory if confirmed.

## Returns

`Promise`\<`string`\>

The backup file path if created, or null if backup was declined or .env not found
