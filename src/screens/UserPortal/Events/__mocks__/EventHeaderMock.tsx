import React from 'react';

type Props = {
  viewType?: string | null;
  handleChangeView?: (v: string | null) => void;
  showInviteModal?: () => void;
};

export default function EventHeaderMock({
  viewType,
  handleChangeView,
  showInviteModal,
}: Props) {
  return (
    <div>
      <div data-testid="calendarEventHeader">
        <div className="_calendar__controls">
          <button
            data-testid="selectViewType"
            onClick={() => handleChangeView?.('MONTH')}
          >
            Month View
          </button>
          <div>
            <button
              data-testid="selectDay"
              onClick={() => handleChangeView?.('DAY')}
            >
              Select Day
            </button>
            <button
              data-testid="selectYear"
              onClick={() => handleChangeView?.('YEAR')}
            >
              Select Year
            </button>
          </div>
          <button
            data-testid="createEventModalBtn"
            onClick={() => showInviteModal?.()}
          >
            Create
          </button>
          <button
            data-testid="handleChangeNullBtn"
            onClick={() => handleChangeView && handleChangeView(null)}
          >
            Null
          </button>
          <div data-testid="calendar-view-type-header">{String(viewType)}</div>
        </div>
      </div>
    </div>
  );
}
