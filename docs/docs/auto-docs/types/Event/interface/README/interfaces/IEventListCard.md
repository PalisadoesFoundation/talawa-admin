[Admin Docs](/)

***

# Interface: IEventListCard

Defined in: [src/types/Event/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L145)

Props for EventListCard component.

`@remarks` Extends IEvent and adds optional refetchEvents callback.

## Extends

- [`IEvent`](types\Event\interface\README\interfaces\IEvent.md)

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L53)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`allDay`](types\Event\interface\README\interfaces\IEvent.md#allday)

***

### attendees

> **attendees**: `Partial`\<[`User`](types\Event\type\README\type-aliases\User.md)\>[]

Defined in: [src/types/Event/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L67)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`attendees`](types\Event\interface\README\interfaces\IEvent.md#attendees)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`averageFeedbackScore`](types\Event\interface\README\interfaces\IEvent.md#averagefeedbackscore)

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

#### id

> **id**: `string`

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`baseEvent`](types\Event\interface\README\interfaces\IEvent.md#baseevent)

***

### createChat?

> `optional` **createChat**: `boolean`

Defined in: [src/types/Event/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L66)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`createChat`](types\Event\interface\README\interfaces\IEvent.md#createchat)

***

### creator

> **creator**: `Partial`\<[`User`](types\Event\type\README\type-aliases\User.md)\>

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`creator`](types\Event\interface\README\interfaces\IEvent.md#creator)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`description`](types\Event\interface\README\interfaces\IEvent.md#description)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`endAt`](types\Event\interface\README\interfaces\IEvent.md#endat)

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`endDate`](types\Event\interface\README\interfaces\IEvent.md#enddate)

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/Event/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L52)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`endTime`](types\Event\interface\README\interfaces\IEvent.md#endtime)

***

### feedback?

> `optional` **feedback**: [`Feedback`](types\Event\type\README\type-aliases\Feedback.md)[]

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`feedback`](types\Event\interface\README\interfaces\IEvent.md#feedback)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L78)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`hasExceptions`](types\Event\interface\README\interfaces\IEvent.md#hasexceptions)

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L43)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`id`](types\Event\interface\README\interfaces\IEvent.md#id)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

Determines if the event is restricted to invited participants only.
When true, only invited users can see and access the event.

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`isInviteOnly`](types\Event\interface\README\interfaces\IEvent.md#isinviteonly)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L59)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`isPublic`](types\Event\interface\README\interfaces\IEvent.md#ispublic)

***

### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L72)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`isRecurringEventTemplate`](types\Event\interface\README\interfaces\IEvent.md#isrecurringeventtemplate)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L60)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`isRegisterable`](types\Event\interface\README\interfaces\IEvent.md#isregisterable)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L42)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`key`](types\Event\interface\README\interfaces\IEvent.md#key)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L44)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`location`](types\Event\interface\README\interfaces\IEvent.md#location)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L45)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`name`](types\Event\interface\README\interfaces\IEvent.md#name)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L79)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`progressLabel`](types\Event\interface\README\interfaces\IEvent.md#progresslabel)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L81)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`recurrenceDescription`](types\Event\interface\README\interfaces\IEvent.md#recurrencedescription)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L82)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`recurrenceRule`](types\Event\interface\README\interfaces\IEvent.md#recurrencerule)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L147)

Optional callback to refresh the events list after modifications.

#### Returns

`void`

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L76)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`sequenceNumber`](types\Event\interface\README\interfaces\IEvent.md#sequencenumber)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`startAt`](types\Event\interface\README\interfaces\IEvent.md#startat)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`startDate`](types\Event\interface\README\interfaces\IEvent.md#startdate)

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`startTime`](types\Event\interface\README\interfaces\IEvent.md#starttime)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L77)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`totalCount`](types\Event\interface\README\interfaces\IEvent.md#totalcount)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L54)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`userId`](types\Event\interface\README\interfaces\IEvent.md#userid)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L41)

#### Inherited from

[`IEvent`](types\Event\interface\README\interfaces\IEvent.md).[`userRole`](types\Event\interface\README\interfaces\IEvent.md#userrole)
