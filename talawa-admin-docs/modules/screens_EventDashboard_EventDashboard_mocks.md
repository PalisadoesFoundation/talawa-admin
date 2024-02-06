[talawa-admin](../README.md) / [Modules](../modules.md) / screens/EventDashboard/EventDashboard.mocks

# Module: screens/EventDashboard/EventDashboard.mocks

## Table of contents

### Variables

- [queryMockWithTime](screens_EventDashboard_EventDashboard_mocks.md#querymockwithtime)
- [queryMockWithoutTime](screens_EventDashboard_EventDashboard_mocks.md#querymockwithouttime)

## Variables

### queryMockWithTime

• `Const` **queryMockWithTime**: (\{ `request`: \{ `query`: `DocumentNode` = EVENT\_FEEDBACKS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay?`: `undefined` = false; `attendees?`: `undefined` = []; `averageFeedbackScore`: `number` = 0; `description?`: `undefined` = 'This is a new update'; `endDate?`: `undefined` = '2/2/23'; `endTime?`: `undefined` = '07:00'; `feedback`: `never`[] = []; `location?`: `undefined` = 'New Delhi'; `organization?`: `undefined` ; `startDate?`: `undefined` = '1/1/23'; `startTime?`: `undefined` = '02:00'; `title?`: `undefined` = 'Updated title' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay`: `boolean` = false; `attendees`: \{ `_id`: `string` = 'user1' \}[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `location`: `string` = 'India'; `organization`: \{ `_id`: `string` = 'org1'; `members`: \{ `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[]  \} ; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' \}  \}  \}  \})[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/66ecb91/src/screens/EventDashboard/EventDashboard.mocks.ts#L69)

___

### queryMockWithoutTime

• `Const` **queryMockWithoutTime**: (\{ `request`: \{ `query`: `DocumentNode` = EVENT\_FEEDBACKS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay?`: `undefined` = false; `attendees?`: `undefined` = []; `averageFeedbackScore`: `number` = 0; `description?`: `undefined` = 'This is a new update'; `endDate?`: `undefined` = '2/2/23'; `endTime?`: `undefined` = '07:00'; `feedback`: `never`[] = []; `location?`: `undefined` = 'New Delhi'; `organization?`: `undefined` ; `startDate?`: `undefined` = '1/1/23'; `startTime?`: `undefined` = '02:00'; `title?`: `undefined` = 'Updated title' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: \{ `id`: `string` = '' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = ''; `allDay`: `boolean` = false; `attendees`: `never`[] = []; `averageFeedbackScore?`: `undefined` = 0; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `feedback?`: `undefined` = []; `location`: `string` = 'India'; `organization`: \{ `_id`: `string` = ''; `members`: `never`[] = [] \} ; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay`: `boolean` = false; `attendees`: \{ `_id`: `string` = 'user1' \}[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: ``null`` = null; `location`: `string` = 'India'; `organization`: \{ `_id`: `string` = 'org1'; `members`: \{ `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[]  \} ; `startDate`: `string` = '1/1/23'; `startTime`: ``null`` = null; `title`: `string` = 'Event Title' \}  \}  \}  \})[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/66ecb91/src/screens/EventDashboard/EventDashboard.mocks.ts#L102)
