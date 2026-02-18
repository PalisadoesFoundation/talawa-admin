---
id: actionitems-components
title: ActionItems Modal Components
slug: /developer-resources/actionitems-components
sidebar_position: 44
---

## Overview

The ActionItems modal system provides reusable components for managing action items (tasks assigned to volunteers or volunteer groups) in Talawa Admin. It includes specialized modals for creating, viewing, and deleting action items with support for recurring events and group assignments.

**Key Features:**

- Create and edit action items with category, volunteer/group assignment, and dates
- View detailed action item information in read-only mode
- Delete action items with confirmation and recurring event handling
- Support for assigning to individual volunteers or volunteer groups
- Template vs. instance distinction for recurring event management
- MUI Autocomplete for volunteer/group/category selection with keyboard navigation
- Completion tracking with pre/post-completion notes
- i18n ready with full internationalization support

**Why Use ActionItems Components:**

- **Consistent UI:** Standardized modals for all action item operations across the application
- **Accessibility:** WCAG 2.1 Level AA compliant with proper labels, roles, and keyboard navigation
- **Flexibility:** Handles both one-time and recurring event action items with different mutation strategies
- **Type Safety:** Fully typed interfaces for all props and data structures
- **Testing:** Comprehensive test coverage with proper MUI Autocomplete interaction patterns

## Component Location

```text
src/shared-components/ActionItems/
  ├── ActionItemModal/
  │   ├── [ActionItemModal.tsx](http://_vscodecontentref_/0)              # Create/Edit action item modal
  │   ├── ActionItemModal.module.css
  │   └── ActionItemModal.spec.tsx
  ├── ActionItemViewModal/
  │   ├── [ActionItemViewModal.tsx](http://_vscodecontentref_/1)          # Read-only view modal
  │   ├── ActionItemViewModal.module.css
  │   └── ActionItemViewModal.spec.tsx
  ├── ActionItemDeleteModal/
  │   ├── [ActionItemDeleteModal.tsx](http://_vscodecontentref_/2)        # Delete confirmation modal
  │   ├── ActionItemDeleteModal.module.css
  │   └── ActionItemDeleteModal.spec.tsx
  ├── ActionItemUpdateModal/                                              # Status update modals
  ├── [ActionItem.mocks.ts](http://_vscodecontentref_/3)                  # GraphQL query/mutation mocks
  └── ActionItemUpdateModal/
```

## Type Definitions:

```text
src/types/shared-components/ActionItems/interface.ts
```

## Related Components:

`AssignmentTypeSelector` - Chip-based toggle for volunteer vs. volunteer group selection
`ApplyToSelector` - Radio group for series vs. instance selection (recurring events)
`FormFieldGroup` - Wrapper for form fields
`DatePicker` - Date selection component
`BaseModal` - Base modal wrapper with backdrop handling Quick Start
`ActionItemModal` (Create/Edit)


## Quick Start
### ActionItemModal (Create/Edit)
```tsx
import ActionItemModal from 'shared-components/ActionItems/ActionItemModal/ActionItemModal';

<ActionItemModal
  isOpen={showModal}
  hide={() => setShowModal(false)}
  orgId="organization-123"
  eventId="event-456"
  actionItem={null}  // null for create, object for edit
  editMode={false}
  actionItemsRefetch={refetchActionItems}
  isRecurring={false}
/>
```

### ActionItemViewModal (Read-Only)
```tsx
import ActionItemViewModal from 'shared-components/ActionItems/ActionItemViewModal/ActionItemViewModal';

<ActionItemViewModal
  isOpen={showModal}
  hide={() => setShowModal(false)}
  item={actionItemData}
/>
```

### ActionItemDeleteModal (Confirmation)
```tsx
import ActionItemDeleteModal from 'shared-components/ActionItems/ActionItemDeleteModal/ActionItemDeleteModal';

<ActionItemDeleteModal
  isOpen={showModal}
  hide={() => setShowModal(false)}
  actionItem={actionItemData}
  actionItemsRefetch={refetchActionItems}
  eventId="event-456"
  isRecurring={true}
/>
```

## Usage Examples
### Complete Create Flow
```tsx
import React, { useState } from 'react';
import ActionItemModal from 'shared-components/ActionItems/ActionItemModal/ActionItemModal';
import { Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';

export const ActionItemsManager = ({ eventId, orgId }) => {
  const [showModal, setShowModal] = useState(false);
  const { refetch: refetchActionItems } = useQuery(GET_EVENT_ACTION_ITEMS, {
    variables: { input: { id: eventId } },
  });

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Create Action Item</Button>
      
      <ActionItemModal
        isOpen={showModal}
        hide={() => setShowModal(false)}
        orgId={orgId}
        eventId={eventId}
        actionItem={null}
        editMode={false}
        actionItemsRefetch={refetchActionItems}
      />
    </>
  );
};
```

### Edit Flow with Recurring Support
```tsx
import React, { useState } from 'react';
import ActionItemModal from 'shared-components/ActionItems/ActionItemModal/ActionItemModal';
import { useQuery } from '@apollo/client';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';

export const EditActionItem = ({ actionItem, eventId, orgId, isRecurringEvent }) => {
  const [showModal, setShowModal] = useState(false);
  const { refetch: refetchActionItems } = useQuery(GET_EVENT_ACTION_ITEMS, {
    variables: { input: { id: eventId } },
  });

  return (
    <>
      <button onClick={() => setShowModal(true)}>Edit</button>
      
      <ActionItemModal
        isOpen={showModal}
        hide={() => setShowModal(false)}
        orgId={orgId}
        eventId={eventId}
        actionItem={actionItem}
        editMode={true}
        actionItemsRefetch={refetchActionItems}
        isRecurring={isRecurringEvent}
        baseEvent={actionItem.event}
      />
    </>
  );
};
```

### Delete With Confirmation
```tsx
import React, { useState } from 'react';
import ActionItemDeleteModal from 'shared-components/ActionItems/ActionItemDeleteModal/ActionItemDeleteModal';
import { Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';

export const DeleteActionItem = ({ actionItem, eventId, isRecurringEvent }) => {
  const [showModal, setShowModal] = useState(false);
  const { refetch: refetchActionItems } = useQuery(GET_EVENT_ACTION_ITEMS, {
    variables: { input: { id: eventId } },
  });

  return (
    <>
      <Button variant="danger" onClick={() => setShowModal(true)}>Delete</Button>
      
      <ActionItemDeleteModal
        isOpen={showModal}
        hide={() => setShowModal(false)}
        actionItem={actionItem}
        actionItemsRefetch={refetchActionItems}
        eventId={eventId}
        isRecurring={isRecurringEvent}
      />
    </>
  );
};
```

## Component API

---

### ActionItemModal Props

| Prop                   | Type                              | Required | Default | Description |
|------------------------|-----------------------------------|----------|---------|-------------|
| `isOpen`               | `boolean`                         | Yes      | –       | Controls modal visibility |
| `hide`                 | `() => void`                      | Yes      | –       | Callback to close the modal |
| `orgId`                | `string`                          | Yes      | –       | Organization ID for category/volunteer queries |
| `eventId`              | `string \| undefined`             | Yes      | –       | Event ID for volunteer group queries (`undefined` for organization-level) |
| `actionItem`           | `IActionItemInfo \| null`          | Yes      | –       | Action item object for edit mode, `null` for create |
| `editMode`             | `boolean`                         | Yes      | –       | Controls form behavior (create vs. edit) |
| `actionItemsRefetch`   | `() => void`                      | Yes      | –       | Callback to refetch action items after mutation |
| `orgActionItemsRefetch`| `() => void`                      | No       | –       | Optional callback for organization-level refetch |
| `isRecurring`          | `boolean`                         | No       | `false` | Show series/instance selector for recurring events |
| `baseEvent`            | `{ id: string } \| null`          | No       | –       | Base event reference for recurring event handling |

---

### ActionItemViewModal Props

| Prop     | Type               | Required | Default | Description |
|----------|--------------------|----------|---------|-------------|
| `isOpen` | `boolean`          | Yes      | –       | Controls modal visibility |
| `hide`   | `() => void`       | Yes      | –       | Callback to close the modal |
| `item`   | `IActionItemInfo`  | Yes      | –       | Action item data to display |

---

### ActionItemDeleteModal Props

| Prop                 | Type               | Required | Default | Description |
|----------------------|--------------------|----------|---------|-------------|
| `isOpen`             | `boolean`          | Yes      | –       | Controls modal visibility |
| `hide`               | `() => void`       | Yes      | –       | Callback to close the modal |
| `actionItem`         | `IActionItemInfo`  | Yes      | –       | Action item to delete |
| `actionItemsRefetch` | `() => void`       | Yes      | –       | Callback to refetch after deletion |
| `eventId`            | `string`           | No       | –       | Event ID for instance-specific deletion |
| `isRecurring`        | `boolean`          | No       | `false` | Show series/instance selector for recurring events |


