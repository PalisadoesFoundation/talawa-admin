[Admin Docs](/)

***

# Function: backupEnvFile()

> **backupEnvFile**(): `Promise`\<`string`\>

Defined in: [src/setup/backupEnvFile/backupEnvFile.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/backupEnvFile/backupEnvFile.ts#L13)

Prompts the user to back up the current .env file before setup modifications.
Creates a timestamped backup in the .backup directory if confirmed.

## Returns

`Promise`\<`string`\>

The backup file path if created, or null if backup was declined or .env not found
