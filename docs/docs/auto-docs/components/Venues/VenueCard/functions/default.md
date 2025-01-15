[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/Venues/VenueCard](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element`

Defined in: [src/components/Venues/VenueCard.tsx:39](https://github.com/gautam-divyanshu/talawa-admin/blob/9fef64ff9fb30eb3195cc9100606d8b7a89bca79/src/components/Venues/VenueCard.tsx#L39)

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
