/**
 * @description Mock component for EventCalender used in testing the Events screen.
 * Exposes event data as JSON and view type for test assertions.
 */

import React from 'react';

type Props = {
  onMonthChange?: (month: number, year: number) => void;
  eventData?: unknown[];
  viewType?: string | null;
};

export default function EventCalenderMock({
  onMonthChange,
  eventData,
  viewType,
}: Props) {
  return (
    <div>
      <button
        type="button"
        data-testid="monthChangeBtn"
        onClick={() => onMonthChange?.(5, 2023)}
      />
      <div data-testid="hour" />
      <div data-testid="monthView" />
      <pre data-testid="event-data-json">{JSON.stringify(eventData ?? [])}</pre>
      <div data-testid="calendar-view-type">{String(viewType)}</div>
    </div>
  );
}
