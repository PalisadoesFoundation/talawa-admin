[talawa-admin](../README.md) / [Modules](../modules.md) / screens/EventDashboard/EventDashboard.mocks

# Module: screens/EventDashboard/EventDashboard.mocks

## Table of contents

### Variables

<<<<<<< HEAD
=======
- [queryMockWithProject](screens_EventDashboard_EventDashboard_mocks.md#querymockwithproject)
- [queryMockWithProjectAndTask](screens_EventDashboard_EventDashboard_mocks.md#querymockwithprojectandtask)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
- [queryMockWithTime](screens_EventDashboard_EventDashboard_mocks.md#querymockwithtime)
- [queryMockWithoutTime](screens_EventDashboard_EventDashboard_mocks.md#querymockwithouttime)

## Variables

<<<<<<< HEAD
### queryMockWithTime

• `Const` **queryMockWithTime**: (\{ `request`: \{ `query`: `DocumentNode` = EVENT\_FEEDBACKS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay?`: `undefined` = false; `attendees?`: `undefined` = []; `averageFeedbackScore`: `number` = 0; `description?`: `undefined` = 'This is a new update'; `endDate?`: `undefined` = '2/2/23'; `endTime?`: `undefined` = '07:00'; `feedback`: `never`[] = []; `location?`: `undefined` = 'New Delhi'; `organization?`: `undefined` ; `startDate?`: `undefined` = '1/1/23'; `startTime?`: `undefined` = '02:00'; `title?`: `undefined` = 'Updated title' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay`: `boolean` = false; `attendees`: \{ `_id`: `string` = 'user1' \}[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `location`: `string` = 'India'; `organization`: \{ `_id`: `string` = 'org1'; `members`: \{ `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[]  \} ; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' \}  \}  \}  \})[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/screens/EventDashboard/EventDashboard.mocks.ts#L69)
=======
### queryMockWithProject

• `Const` **queryMockWithProject**: { `request`: { `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: { `id`: `string` = 'event123' }  } ; `result`: { `data`: { `event`: { `allDay`: `boolean` = false; `attendees`: { `_id`: `string` = 'user1' }[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `location`: `string` = 'India'; `organization`: { `_id`: `string` = 'org1'; `members`: { `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' }[]  } ; `projects`: { `_id`: `string` = 'project1'; `description`: `string` = 'Project Description 1'; `tasks`: `never`[] = []; `title`: `string` = 'Project 1' }[] ; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' }  }  }  }[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L68)

___

### queryMockWithProjectAndTask

• `Const` **queryMockWithProjectAndTask**: { `request`: { `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: { `id`: `string` = 'event123' }  } ; `result`: { `data`: { `event`: { `allDay`: `boolean` = false; `attendees`: { `_id`: `string` = 'user1' }[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `location`: `string` = 'India'; `organization`: { `_id`: `string` = 'org1'; `members`: { `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' }[]  } ; `projects`: { `_id`: `string` = 'project1'; `description`: `string` = 'Project Description 1'; `tasks`: { `_id`: `string` = 'task1'; `completed`: `boolean` = false; `deadline`: `string` = '22/12/23'; `description`: `string` = 'Description 1'; `title`: `string` = 'Task 1'; `volunteers`: `never`[] = [] }[] ; `title`: `string` = 'Project 1' }[] ; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' }  }  }  }[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L107)

___

### queryMockWithTime

• `Const` **queryMockWithTime**: { `request`: { `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: { `id`: `string` = 'event123' }  } ; `result`: { `data`: { `event`: { `allDay`: `boolean` = false; `attendees`: { `_id`: `string` = 'user1' }[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `location`: `string` = 'India'; `organization`: { `_id`: `string` = 'org1'; `members`: { `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' }[]  } ; `projects`: `never`[] = []; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' }  }  }  }[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L4)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

___

### queryMockWithoutTime

<<<<<<< HEAD
• `Const` **queryMockWithoutTime**: (\{ `request`: \{ `query`: `DocumentNode` = EVENT\_FEEDBACKS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay?`: `undefined` = false; `attendees?`: `undefined` = []; `averageFeedbackScore`: `number` = 0; `description?`: `undefined` = 'This is a new update'; `endDate?`: `undefined` = '2/2/23'; `endTime?`: `undefined` = '07:00'; `feedback`: `never`[] = []; `location?`: `undefined` = 'New Delhi'; `organization?`: `undefined` ; `startDate?`: `undefined` = '1/1/23'; `startTime?`: `undefined` = '02:00'; `title?`: `undefined` = 'Updated title' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: \{ `id`: `string` = '' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = ''; `allDay`: `boolean` = false; `attendees`: `never`[] = []; `averageFeedbackScore?`: `undefined` = 0; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: `string` = '09:00:00'; `feedback?`: `undefined` = []; `location`: `string` = 'India'; `organization`: \{ `_id`: `string` = ''; `members`: `never`[] = [] \} ; `startDate`: `string` = '1/1/23'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Event Title' \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: \{ `id`: `string` = 'event123' \}  \} ; `result`: \{ `data`: \{ `event`: \{ `_id`: `string` = 'event123'; `allDay`: `boolean` = false; `attendees`: \{ `_id`: `string` = 'user1' \}[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: ``null`` = null; `location`: `string` = 'India'; `organization`: \{ `_id`: `string` = 'org1'; `members`: \{ `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[]  \} ; `startDate`: `string` = '1/1/23'; `startTime`: ``null`` = null; `title`: `string` = 'Event Title' \}  \}  \}  \})[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/12d9229/src/screens/EventDashboard/EventDashboard.mocks.ts#L102)
=======
• `Const` **queryMockWithoutTime**: { `request`: { `query`: `DocumentNode` = EVENT\_DETAILS; `variables`: { `id`: `string` = 'event123' }  } ; `result`: { `data`: { `event`: { `allDay`: `boolean` = false; `attendees`: { `_id`: `string` = 'user1' }[] ; `description`: `string` = 'Event Description'; `endDate`: `string` = '2/2/23'; `endTime`: ``null`` = null; `location`: `string` = 'India'; `organization`: { `_id`: `string` = 'org1'; `members`: { `_id`: `string` = 'user1'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' }[]  } ; `projects`: `never`[] = []; `startDate`: `string` = '1/1/23'; `startTime`: ``null`` = null; `title`: `string` = 'Event Title' }  }  }  }[]

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L36)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
