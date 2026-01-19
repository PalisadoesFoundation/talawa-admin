---
id: crud-modal-template
title: CRUDModalTemplate Component
slug: /developer-resources/crud-modal-template
sidebar_position: 38
---

## Overview

The `CRUDModalTemplate` is a standardized, reusable modal system for performing Create, Read, Update, and Delete operations across the Talawa Admin application. It provides consistent modal behavior, loading states, error handling, and accessibility features.

**Key Features:**

- Four specialized modal types: Create, Edit, Delete, and View
- Built-in loading states for data fetching and form submission
- Auto-focus on first input field
- Keyboard accessibility (Escape to close)
- Consistent styling and layout
- i18n ready

**Why Use CRUDModalTemplate:**

- **Consistency:** Ensures all CRUD modals across the application have uniform behavior and appearance
- **Reduced Boilerplate:** Common features like loading states and form handling are pre-integrated
- **Maintainability:** Changes to modal behavior can be made in one place
- **Accessibility:** Built-in keyboard navigation and focus management

## Component Location

```text
src/shared-components/CRUDModalTemplate/
  ├── CRUDModalTemplate.tsx       # Base modal component
  ├── CRUDModalTemplate.module.css
  ├── CRUDModalTemplate.spec.tsx
  ├── CreateModal.tsx             # Create entity modal
  ├── EditModal.tsx               # Edit entity modal
  ├── DeleteModal.tsx             # Delete entity modal
  └── ViewModal.tsx               # View entity modal (read-only)
```

**Type Definitions:**

```text
src/types/shared-components/CRUDModalTemplate/interface.ts
```

## Quick Start

### CreateModal

```tsx
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { Form } from 'react-bootstrap';

<CreateModal
  title="Create New Event"
  onClose={() => setShowModal(false)}
  onSubmit={handleSubmit}
  loading={isSubmitting}
  submitDisabled={!isFormValid}
>
  <Form.Group className="mb-3">
    <Form.Label>Event Name</Form.Label>
    <Form.Control
      type="text"
      value={eventName}
      onChange={(e) => setEventName(e.target.value)}
    />
  </Form.Group>
</CreateModal>
```

### EditModal

```tsx
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { Form } from 'react-bootstrap';

<EditModal
  title="Edit Event"
  onClose={() => setShowModal(false)}
  onSubmit={handleSubmit}
  loading={isSubmitting}
  loadingData={isFetchingData}
  submitDisabled={!hasChanges}
>
  <Form.Group className="mb-3">
    <Form.Label>Event Name</Form.Label>
    <Form.Control
      type="text"
      value={eventName}
      onChange={(e) => setEventName(e.target.value)}
    />
  </Form.Group>
</EditModal>
```

### DeleteModal

```tsx
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';

<DeleteModal
  title="Delete Event"
  entityName="Annual Conference 2024"
  onClose={() => setShowModal(false)}
  onDelete={handleDelete}
  showWarning={true}
/>
```

### ViewModal

```tsx
import { ViewModal } from 'shared-components/CRUDModalTemplate/ViewModal';
import { Button } from 'react-bootstrap';

<ViewModal
  title="Event Details"
  onClose={() => setShowModal(false)}
  loadingData={isFetchingData}
  customActions={
    <>
      <Button variant="outline-primary" onClick={handleEdit}>
        Edit
      </Button>
    </>
  }
>
  <div>
    <strong>Event Name:</strong>
    <p>Annual Conference 2024</p>
  </div>
</ViewModal>
```

## Component API

### CreateModal Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | The title displayed in the modal header |
| `onClose` | `() => void` | Yes | - | Callback function when the modal is closed |
| `onSubmit` | `(e: FormEvent) => void` | Yes | - | Callback function when the form is submitted |
| `children` | `ReactNode` | Yes | - | Form fields to render inside the modal body |
| `loading` | `boolean` | No | `false` | Shows a loading spinner on the submit button |
| `submitDisabled` | `boolean` | No | `false` | Disables the submit button |

### EditModal Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | The title displayed in the modal header |
| `onClose` | `() => void` | Yes | - | Callback function when the modal is closed |
| `onSubmit` | `(e: FormEvent) => void` | Yes | - | Callback function when the form is submitted |
| `children` | `ReactNode` | Yes | - | Form fields to render inside the modal body |
| `loading` | `boolean` | No | `false` | Shows a loading spinner on the submit button |
| `loadingData` | `boolean` | No | `false` | Shows a full modal loading state when fetching entity data |
| `submitDisabled` | `boolean` | No | `false` | Disables the submit button |

### DeleteModal Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | The title displayed in the modal header |
| `onClose` | `() => void` | Yes | - | Callback function when the modal is closed |
| `onDelete` | `() => void` | Yes | - | Callback function when the delete action is confirmed |
| `entityName` | `string` | Yes | - | The name of the entity being deleted |
| `showWarning` | `boolean` | No | `false` | Shows a warning alert about the irreversible nature of the action |
| `recurringEventContent` | `ReactNode` | No | - | Optional content for handling recurring event deletion options |

### ViewModal Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | The title displayed in the modal header |
| `onClose` | `() => void` | Yes | - | Callback function when the modal is closed |
| `children` | `ReactNode` | Yes | - | Content to display inside the modal body |
| `loadingData` | `boolean` | No | `false` | Shows a loading state when fetching entity data |
| `customActions` | `ReactNode` | No | - | Optional custom action buttons for the modal footer |

## Usage Examples

### CreateModal with Validation

```tsx
import React, { useState } from 'react';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { Form } from 'react-bootstrap';

export const CreateEventModal = ({ show, onClose, onSuccess }) => {
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = eventName.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent({ name: eventName });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <CreateModal
      title="Create New Event"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitDisabled={!isFormValid}
    >
      <Form.Group className="mb-3">
        <Form.Label>Event Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter event name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </Form.Group>
    </CreateModal>
  );
};
```

### EditModal with Data Fetching

```tsx
import React, { useState, useEffect } from 'react';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { Form } from 'react-bootstrap';

export const EditEventModal = ({ show, eventId, onClose, onSuccess }) => {
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (show && eventId) {
      setLoadingData(true);
      fetchEvent(eventId)
        .then((event) => setEventName(event.name))
        .finally(() => setLoadingData(false));
    }
  }, [show, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEvent(eventId, { name: eventName });
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <EditModal
      title="Edit Event"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      loadingData={loadingData}
      submitDisabled={!eventName.trim()}
    >
      <Form.Group className="mb-3">
        <Form.Label>Event Name</Form.Label>
        <Form.Control
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </Form.Group>
    </EditModal>
  );
};
```

### DeleteModal with Recurring Events

```tsx
import React, { useState } from 'react';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';

export const DeleteEventModal = ({ show, event, onClose, onSuccess }) => {
  const [deleteOption, setDeleteOption] = useState('single');

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id, { deleteOption });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  if (!show) return null;

  const recurringContent = event.isRecurring ? (
    <div className="mt-3">
      <p className="mb-2">This is a recurring event. How would you like to proceed?</p>
      <div className="d-flex flex-column gap-2">
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            name="deleteOption"
            value="single"
            checked={deleteOption === 'single'}
            onChange={(e) => setDeleteOption(e.target.value)}
          />
          <span>Delete only this occurrence</span>
        </label>
        <label className="d-flex align-items-center gap-2">
          <input
            type="radio"
            name="deleteOption"
            value="all"
            checked={deleteOption === 'all'}
            onChange={(e) => setDeleteOption(e.target.value)}
          />
          <span>Delete all occurrences</span>
        </label>
      </div>
    </div>
  ) : null;

  return (
    <DeleteModal
      title="Delete Event"
      entityName={event.name}
      onClose={onClose}
      onDelete={handleDelete}
      showWarning={true}
      recurringEventContent={recurringContent}
    />
  );
};
```

### ViewModal with Custom Actions

```tsx
import React from 'react';
import { ViewModal } from 'shared-components/CRUDModalTemplate/ViewModal';
import { Button } from 'react-bootstrap';

export const ViewEventModal = ({ show, event, loadingData, onClose, onEdit, onDelete }) => {
  if (!show) return null;

  return (
    <ViewModal
      title="Event Details"
      onClose={onClose}
      loadingData={loadingData}
      customActions={
        <>
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </>
      }
    >
      <div className="mb-3">
        <strong>Event Name:</strong>
        <p className="mb-0">{event?.name}</p>
      </div>
      <div className="mb-3">
        <strong>Date:</strong>
        <p className="mb-0">{event?.date}</p>
      </div>
      <div className="mb-3">
        <strong>Location:</strong>
        <p className="mb-0">{event?.location}</p>
      </div>
      <div className="mb-3">
        <strong>Description:</strong>
        <p className="mb-0">{event?.description}</p>
      </div>
    </ViewModal>
  );
};
```

## Common Patterns and Best Practices

### Form Validation

Always validate form inputs before enabling the submit button:

```tsx
// ✅ Good: Submit disabled until form is valid
const isFormValid = name.trim() && email.includes('@');

<CreateModal
  title="Create User"
  onSubmit={handleSubmit}
  submitDisabled={!isFormValid}
  loading={loading}
>
  {/* form fields */}
</CreateModal>
```

### Loading States

Use appropriate loading states for different scenarios:

```tsx
// ✅ Good: Separate loading states
<EditModal
  title="Edit User"
  onSubmit={handleSubmit}
  loading={isSubmitting}      // For form submission
  loadingData={isFetching}    // For initial data fetch
>
  {/* form fields */}
</EditModal>
```

### Error Handling

Handle errors gracefully and provide feedback to users:

```tsx
// ✅ Good: Error handling with user feedback
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await createEntity(formData);
    onSuccess();
    onClose();
  } catch (error) {
    toast.error('Failed to create entity. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Controlled Modal Visibility

Control modal visibility from the parent component:

```tsx
// ✅ Good: Parent controls visibility
const ParentComponent = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCreateModal(true)}>Create</Button>
      {showCreateModal && (
        <CreateModal
          title="Create Item"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleSubmit}
        >
          {/* form fields */}
        </CreateModal>
      )}
    </>
  );
};
```

### i18n Support

Use translation keys for user-facing text:

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('events');

<CreateModal
  title={t('createEvent')}
  onClose={onClose}
  onSubmit={handleSubmit}
>
  <Form.Group className="mb-3">
    <Form.Label>{t('eventName')}</Form.Label>
    <Form.Control placeholder={t('enterEventName')} />
  </Form.Group>
</CreateModal>
```

### Delete Confirmation

Always use `showWarning` for destructive actions:

```tsx
// ✅ Good: Warning shown for delete
<DeleteModal
  title="Delete User"
  entityName={user.name}
  onDelete={handleDelete}
  showWarning={true}  // Important for user awareness
/>
```

## Accessibility

The CRUDModalTemplate components include built-in accessibility features:

- **Focus Management:** Auto-focus on the first input field when the modal opens
- **Keyboard Navigation:** Press Escape to close the modal
- **ARIA Attributes:** Proper role and label attributes for screen readers
- **Focus Trapping:** Focus is trapped within the modal while open

## Testing

When testing components that use CRUDModalTemplate:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';

describe('CreateModal', () => {
  test('renders modal with title', () => {
    render(
      <CreateModal
        title="Create Item"
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      >
        <input data-testid="name-input" />
      </CreateModal>
    );

    expect(screen.getByText('Create Item')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    const onClose = jest.fn();

    render(
      <CreateModal
        title="Create Item"
        onClose={onClose}
        onSubmit={jest.fn()}
      >
        <input />
      </CreateModal>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  test('disables submit button when submitDisabled is true', () => {
    render(
      <CreateModal
        title="Create Item"
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        submitDisabled={true}
      >
        <input />
      </CreateModal>
    );

    expect(screen.getByText('Create')).toBeDisabled();
  });
});
```

## FAQ

**Q: When should I use CreateModal vs EditModal?**

A: Use `CreateModal` when creating a new entity (empty form) and `EditModal` when modifying an existing entity (pre-populated form with `loadingData` support).

**Q: How do I add custom buttons to the modal footer?**

A: For `ViewModal`, use the `customActions` prop. For `CreateModal` and `EditModal`, the footer buttons are standardized (Cancel/Submit). If you need different buttons, consider using the base `CRUDModalTemplate` directly.

**Q: Can I use these modals with React Hook Form?**

A: Yes, the modals work with any form library. Simply pass your form fields as children and handle the `onSubmit` callback:

```tsx
import { useForm } from 'react-hook-form';

const { register, handleSubmit } = useForm();

<CreateModal
  title="Create Item"
  onClose={onClose}
  onSubmit={handleSubmit(onFormSubmit)}
>
  <input {...register('name')} />
</CreateModal>
```

**Q: How do I customize the modal size?**

A: The modal size is standardized for consistency. If you need a different size for a specific use case, you can use the base `CRUDModalTemplate` component directly and pass size props to the underlying `BaseModal`.

## Related Components

- **BaseModal**: The underlying modal component used by CRUDModalTemplate
- **LoadingState**: Used for loading indicators within modals
- **Form Components**: React Bootstrap form components used for inputs

## See Also

- [Reusable Components Guide](./reusable-components.md)
- [Design Token System](./design-token-system.md)
- [Testing Guide](./testing.md)
