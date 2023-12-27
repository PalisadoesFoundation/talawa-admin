[talawa-admin](../README.md) / [Modules](../modules.md) / screens/EventDashboard/EventDashboard.mocks

# Module: screens/EventDashboard/EventDashboard.mocks

## Table of contents

### Variables

- [queryMockWithProject](screens_EventDashboard_EventDashboard_mocks.md#querymockwithproject)
- [queryMockWithProjectAndTask](screens_EventDashboard_EventDashboard_mocks.md#querymockwithprojectandtask)
- [queryMockWithTime](screens_EventDashboard_EventDashboard_mocks.md#querymockwithtime)
- [queryMockWithoutTime](screens_EventDashboard_EventDashboard_mocks.md#querymockwithouttime)

## Variables

### queryMockWithProject

• **queryMockWithProject** (Array of objects):
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value `EVENT_DETAILS`.
    - `variables`: Object with property:
      - `id` (string): Default value `'event123'`.
  - **result**: Object with properties:
    - `data`: Object with properties:
      - `event`: Object with properties:
        - `allDay` (boolean): Default value `false`.
        - `attendees`: Array of objects, each with `_id` (string) default value `'user1'`.
        - `description` (string): Default value `'Event Description'`.
        - `endDate` (string): Default value `'2/2/23'`.
        - `endTime` (string): Default value `'09:00:00'`.
        - `location` (string): Default value `'India'`.
        - `organization`: Object with properties...
        - `projects`: Array of objects...
        - `startDate` (string): Default value `'1/1/23'`.
        - `startTime` (string): Default value `'08:00:00'`.
        - `title` (string): Default value `'Event Title'`.


#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L68)

___

### queryMockWithProjectAndTask

• **queryMockWithProjectAndTask** (Array of objects):
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value `EVENT_DETAILS`.
    - `variables`: Object with property:
      - `id` (string): Default value `'event123'`.
  - **result**: Object with properties:
    - `data`: Object with properties:
      - `event`: Object with properties:
        - `allDay` (boolean): Default value `false`.
        - `attendees`: Array of objects, each with `_id` (string) default value `'user1'`.
        - `description` (string): Default value `'Event Description'`.
        - `endDate` (string): Default value `'2/2/23'`.
        - `endTime` (string): Default value `'09:00:00'`.
        - `location` (string): Default value `'India'`.
        - `organization`: Object with properties...
        - `projects`: Array of objects...
        - `startDate` (string): Default value `'1/1/23'`.
        - `startTime` (string): Default value `'08:00:00'`.
        - `title` (string): Default value `'Event Title'`.

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L107)

___

### queryMockWithTime

• **queryMockWithTime** (Array of objects):
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value `EVENT_DETAILS`.
    - `variables`: Object with property:
      - `id` (string): Default value `'event123'`.
  - **result**: Object with properties:
    - `data`: Object with properties:
      - `event`: Object with properties:
        - `allDay` (boolean): Default value `false`.
        - `attendees`: Array of objects, each with `_id` (string) default value `'user1'`.
        - `description` (string): Default value `'Event Description'`.
        - `endDate` (string): Default value `'2/2/23'`.
        - `endTime` (string): Default value `'09:00:00'`.
        - `location` (string): Default value `'India'`.
        - `organization`: Object with properties...
        - `projects`: Array of `never` type, default value `[]`.
        - `startDate` (string): Default value `'1/1/23'`.
        - `startTime` (string): Default value `'08:00:00'`.
        - `title` (string): Default value `'Event Title'`.

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L4)

___

### queryMockWithoutTime

• **queryMockWithoutTime** (Array of objects):
  - **request**: Object with properties:
    - `query` (DocumentNode): Default value `EVENT_DETAILS`.
    - `variables`: Object with property:
      - `id` (string): Default value `'event123'`.
  - **result**: Object with properties:
    - `data`: Object with properties:
      - `event`: Object with properties:
        - `allDay` (boolean): Default value `false`.
        - `attendees`: Array of objects, each with `_id` (string) default value `'user1'`.
        - `description` (string): Default value `'Event Description'`.
        - `endDate` (string): Default value `'2/2/23'`.
        - `endTime` (string or null): Default value `null`.
        - `location` (string): Default value `'India'`.
        - `organization`: Object with properties...
        - `projects`: Array of `never` type, default value `[]`.
        - `startDate` (string): Default value `'1/1/23'`.
        - `startTime` (string or null): Default value `null`.
        - `title` (string): Default value `'Event Title'`.

#### Defined in

[src/screens/EventDashboard/EventDashboard.mocks.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/EventDashboard/EventDashboard.mocks.ts#L36)
