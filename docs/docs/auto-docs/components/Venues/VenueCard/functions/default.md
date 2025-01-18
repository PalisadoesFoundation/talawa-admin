[Admin Docs](/)

***

# Function: default()

> **default**(`__namedParameters`): `Element`

Defined in: [src/components/Venues/VenueCard.tsx:39](https://github.com/gautam-divyanshu/talawa-admin/blob/69cd9f147d3701d1db7821366b2c564d1fb49f77/src/components/Venues/VenueCard.tsx#L39)

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
