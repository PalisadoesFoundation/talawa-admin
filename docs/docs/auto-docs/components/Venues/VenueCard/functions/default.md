[Admin Docs](/)

***

# Function: default()

> **default**(`__namedParameters`): `Element`

Defined in: [src/components/Venues/VenueCard.tsx:39](https://github.com/gautam-divyanshu/talawa-admin/blob/10f2081e01fc4f6c0767e35f8c4ed3f09fb1baac/src/components/Venues/VenueCard.tsx#L39)

Represents a card component displaying venue information.

This component renders a card with the venue's image, name, capacity, and description.
It also provides buttons to edit or delete the venue.

## Parameters

### \_\_namedParameters

`InterfaceVenueCardProps`

## Returns

`Element`

JSX.Element - The `VenueCard` component.

## Example

```tsx
<VenueCard
  venueItem={venue}
  index={0}
  showEditVenueModal={handleShowEditVenueModal}
  handleDelete={handleDeleteVenue}
/>
```
