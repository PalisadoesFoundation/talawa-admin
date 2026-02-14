[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/types/Volunteer/interface.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L174)

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L180)

The creation date of the volunteer membership record.

***

### createdBy

> **createdBy**: `object`

Defined in: [src/types/Volunteer/interface.ts:225](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L225)

The user object who created this membership.

#### id

> **id**: `string`

The unique identifier of the creator

#### name

> **name**: `string`

The name of the creator

***

### event

> **event**: `object`

Defined in: [src/types/Volunteer/interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L184)

The event object associated with the volunteer membership.

#### endAt

> **endAt**: `string`

The end of the event

#### id

> **id**: `string`

The unique identifier of the event

#### name

> **name**: `string`

The name of the event

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

#### startAt

> **startAt**: `string`

The start of the event

***

### group?

> `optional` **group**: `object`

Defined in: [src/types/Volunteer/interface.ts:218](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L218)

(Optional) The group object associated with the membership.

#### id

> **id**: `string`

The unique identifier of the group

#### name

> **name**: `string`

The name of the group

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L176)

The unique identifier of the volunteer membership.

***

### status

> **status**: `string`

Defined in: [src/types/Volunteer/interface.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L178)

The status of the volunteer membership.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L182)

The last update date of the volunteer membership record.

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/types/Volunteer/interface.ts:232](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L232)

The user object who last updated this membership.

#### id

> **id**: `string`

The unique identifier of the updater

#### name

> **name**: `string`

The name of the updater

***

### volunteer

> **volunteer**: `object`

Defined in: [src/types/Volunteer/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L198)

The volunteer object associated with the membership.

#### hasAccepted

> **hasAccepted**: `boolean`

Whether the volunteer has accepted

#### hoursVolunteered

> **hoursVolunteered**: `number`

Hours volunteered

#### id

> **id**: `string`

The unique identifier of the volunteer

#### user

> **user**: `object`

The user information of the volunteer

##### user.avatarURL?

> `optional` **avatarURL**: `string`

The avatar URL of the user (optional)

##### user.emailAddress

> **emailAddress**: `string`

The email address of the user

##### user.id

> **id**: `string`

The unique identifier of the user

##### user.name

> **name**: `string`

The name of the user
