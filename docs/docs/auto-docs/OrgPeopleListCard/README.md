[**talawa-admin**](README.md)

***

# OrgPeopleListCard

Component representing a card for managing organization members.

This component displays a modal to confirm the removal of a member from an organization.
It uses GraphQL mutation to handle the removal process and provides feedback to the user
through toast notifications. The modal includes options to confirm or cancel the removal.

## File

OrgPeopleListCard.tsx

## See

[REMOVE\_MEMBER\_MUTATION\_PG](GraphQl\Mutations\mutations\README\variables\REMOVE_MEMBER_MUTATION_PG.md) for the GraphQL mutation used to remove a member.

## Param

The props for the component.

## Param

The ID of the member to be removed.

## Param

Function to toggle the visibility of the modal.

## Remarks

- If the `id` prop is not provided, the user is redirected to the organization list.
- The `useParams` hook is used to retrieve the current organization ID from the URL.
- The `useMutation` hook is used to execute the GraphQL mutation for member removal.
- The `useTranslation` hook is used for internationalization of text content.

## Example

```tsx
<OrgPeopleListCard
  id="member123"
  toggleRemoveModal={() => setShowModal(false)}
/>
```

## Functions

- [default](OrgPeopleListCard\README\functions\default.md)
