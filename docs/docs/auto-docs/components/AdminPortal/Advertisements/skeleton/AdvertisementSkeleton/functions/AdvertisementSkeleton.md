[Admin Docs](/)

***

# Function: AdvertisementSkeleton()

> **AdvertisementSkeleton**(): `Element`[]

Defined in: [src/components/AdminPortal/Advertisements/skeleton/AdvertisementSkeleton.tsx:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/Advertisements/skeleton/AdvertisementSkeleton.tsx#L24)

AdvertisementSkeleton Component

This component renders a skeleton loader for advertisements, typically used
as a placeholder while the actual advertisement data is being fetched or loaded.
It creates a list of 6 skeleton items, each styled to resemble the layout of an
advertisement card.

Each skeleton item includes:
- A shimmering image container to represent the advertisement image.
- A shimmering title placeholder to represent the advertisement name.
- A shimmering button placeholder.

The skeleton items are styled using CSS classes provided by the `styles` object,
and each item is uniquely identified with a `data-testid` attribute for testing purposes.

## Returns

`Element`[]

An array of JSX elements representing the skeleton loaders.
