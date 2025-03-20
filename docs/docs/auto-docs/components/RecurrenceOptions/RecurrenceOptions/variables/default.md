[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceRecurrenceOptionsProps`\>

Defined in: [src/components/RecurrenceOptions/RecurrenceOptions.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/RecurrenceOptions/RecurrenceOptions.tsx#L49)

Renders a dropdown menu for selecting recurrence options.

This component allows users to choose various recurrence rules (daily, weekly, monthly, yearly) for a given event.
It displays the current recurrence rule text and provides options to modify it, including a custom recurrence modal.

The dropdown menu includes options for:
- Daily recurrence
- Weekly recurrence (including a specific day of the week or Monday to Friday)
- Monthly recurrence (on a specific day or occurrence)
- Yearly recurrence
- Custom recurrence (opens a modal for advanced settings)

The displayed recurrence rule text is truncated if it exceeds a specified length, with an overlay showing the full text on hover.

## Param

The properties to configure the recurrence options dropdown.

## Param

The current state of the recurrence rule.

## Param

The text describing the current recurrence rule.

## Param

A function to update the recurrence rule state.

## Param

A JSX element used for displaying additional information on hover.

## Param

A function for translating text.

## Param

A function for translating common text.

## Returns

JSX.Element - The recurrence options dropdown and the custom recurrence modal.
