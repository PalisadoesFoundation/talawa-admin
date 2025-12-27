[**talawa-admin**](README.md)

***

# components/UserPortal/DonationCard/DonationCard

**`Function`**

## File

DonationCard.tsx

## Description

A React functional component that displays a donation card with donor details,
             donation amount, and the date of the donation. Includes a button for further actions.

## Description

Renders a donation card with donor information, donation amount, and formatted date.

## Param

The properties required to render the donation card.

## Param

The name of the donor.

## Param

The amount donated.

## Param

The date when the donation was last updated, in ISO string format.

## Example

```tsx
<donationCard
  name="John Doe"
  amount={100}
  updatedAt="2023-03-15T12:00:00Z"
/>
```

## Remarks

- The `updatedAt` property is parsed into a `Date` object and formatted into a readable string.
- The component uses CSS modules for styling and Bootstrap for the button.
- Ensure that the `InterfaceDonationCardProps` type is correctly defined in the `types/Donation/interface` module.

## Functions

- [default](components\UserPortal\DonationCard\DonationCard\README\functions\default.md)
