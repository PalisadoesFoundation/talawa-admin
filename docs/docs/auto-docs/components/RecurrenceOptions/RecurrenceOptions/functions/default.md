[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/components/RecurrenceOptions/RecurrenceOptions.tsx:49](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/RecurrenceOptions/RecurrenceOptions.tsx#L49)

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

## Parameters

### props

`InterfaceRecurrenceOptionsProps`

The properties to configure the recurrence options dropdown.

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

JSX.Element - The recurrence options dropdown and the custom recurrence modal.
