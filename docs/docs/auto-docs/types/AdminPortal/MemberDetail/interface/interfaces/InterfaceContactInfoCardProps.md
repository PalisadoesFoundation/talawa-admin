[Admin Docs](/)

***

# Interface: InterfaceContactInfoCardProps

Defined in: [src/types/AdminPortal/MemberDetail/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/MemberDetail/interface.ts#L56)

Props for the ContactInfoCard component.

## Properties

### emailAddress?

> `optional` **emailAddress**: `string`

Defined in: [src/types/AdminPortal/MemberDetail/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/MemberDetail/interface.ts#L60)

Email address to display (read-only)

***

### formState

> **formState**: `Record`\<[`ContactInfoField`](../type-aliases/ContactInfoField.md), `string` \| `null`\>

Defined in: [src/types/AdminPortal/MemberDetail/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/MemberDetail/interface.ts#L58)

Form state containing field values

***

### handleFieldChange()

> **handleFieldChange**: (`fieldName`, `value`) => `void`

Defined in: [src/types/AdminPortal/MemberDetail/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/MemberDetail/interface.ts#L62)

Handler for field value changes

#### Parameters

##### fieldName

[`ContactInfoField`](../type-aliases/ContactInfoField.md)

##### value

`string`

#### Returns

`void`
