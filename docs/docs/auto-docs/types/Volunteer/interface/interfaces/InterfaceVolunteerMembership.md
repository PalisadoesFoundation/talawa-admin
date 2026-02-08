[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/types/Volunteer/interface.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L183)

Defines the structure for volunteer membership information.

## Param

The unique identifier of the volunteer membership.

## Param

The status of the volunteer membership.

## Param

The creation date of the volunteer membership record.

## Param

The last update date of the volunteer membership record.

## Param

The event object associated with the volunteer membership.

## Param

The volunteer object associated with the membership.

## Param

(Optional) The group object associated with the membership.

## Param

The user object who created this membership.

## Param

The user object who last updated this membership.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:186](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L186)

***

### createdBy

> **createdBy**: `object`

Defined in: [src/types/Volunteer/interface.ts:226](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L226)

#### id

> **id**: `string`

The unique identifier of the creator

#### name

> **name**: `string`

The name of the creator

***

### event

> **event**: `object`

Defined in: [src/types/Volunteer/interface.ts:188](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L188)

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

Defined in: [src/types/Volunteer/interface.ts:220](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L220)

#### id

> **id**: `string`

The unique identifier of the group

#### name

> **name**: `string`

The name of the group

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L184)

***

### status

> **status**: `string`

Defined in: [src/types/Volunteer/interface.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L185)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:187](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L187)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/types/Volunteer/interface.ts:232](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L232)

#### id

> **id**: `string`

The unique identifier of the updater

#### name

> **name**: `string`

The name of the updater

***

### volunteer

> **volunteer**: `object`

Defined in: [src/types/Volunteer/interface.ts:201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L201)

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
