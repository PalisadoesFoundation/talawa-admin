[Admin Docs](/)

***

# Function: default()

> **default**(`id`): `Element`

Defined in: [src/components/UserPortal/EventCard/EventCard.tsx:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/EventCard/EventCard.tsx#L72)

EventCard Component

This component renders a card displaying details of an event, including its name, description,
location, start and end times, and the creator's name. It also provides functionality for users
to register for the event.

## Parameters

### id

[`InterfaceEventCardProps`](../../../../../types/UserPortal/EventCard/interface/interfaces/InterfaceEventCardProps.md)

Event identifier.

## Returns

`Element`

JSX.Element - A styled card displaying event details and a registration button.

Dependencies
- `@mui/icons-material` for icons.
- `dayjs` for date and time formatting.
- `shared-components/Button` for button UI.
- `@apollo/client` for GraphQL mutations.
- `NotificationToast` for notifications.
- `utils/useLocalstorage` for local storage handling.

## Remarks

- The component uses the `useTranslation` hook for internationalization.
- It retrieves the user ID from local storage to determine if the user is already registered for the event.
- The `useMutation` hook from Apollo Client is used to handle event registration.
- The `NotificationToast` utility is used to display success or error messages.

Component

## Example

```tsx
<EventCard
  id="event123"
  name="Community Meetup"
  description="A meetup for community members."
  location="Community Hall"
  startAt={dayjs.utc().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')}
  endAt={dayjs.utc().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')}
  startTime="10:00:00"
  endTime="12:00:00"
  creator={{ name: "John Doe" }}
  attendees={[{ id: "user456" }]}
  isInviteOnly={false}
/>
```
