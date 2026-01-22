[Admin Docs](/)

***

# Function: resolveAvatarFile()

> **resolveAvatarFile**(`params`): `Promise`\<`File`\>

Defined in: [src/screens/MemberDetail/resolveAvatarFile.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/MemberDetail/resolveAvatarFile.ts#L14)

Resolves the avatar file to use for a member.

## Parameters

### params

[`InterfaceResolveAvatarFileParams`](../../../../types/AdminPortal/MemberDetail/interface/interfaces/InterfaceResolveAvatarFileParams.md)

Object containing avatar information:
  - `newAvatarUploaded`: Whether a new avatar file was uploaded
  - `selectedAvatar`: The uploaded avatar file, if any
  - `avatarURL`: The URL of the existing avatar

## Returns

`Promise`\<`File`\>

A Promise that resolves to the selected File or null if unable to resolve
