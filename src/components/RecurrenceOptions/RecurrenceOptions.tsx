import React, { useState } from 'react';
import { Dropdown, OverlayTrigger } from 'react-bootstrap';
import {
  Days,
  Frequency,
  type InterfaceRecurrenceRuleState,
  getRecurrenceRuleText,
  getWeekDayOccurenceInMonth,
  isLastOccurenceOfWeekDay,
  mondayToFriday,
} from 'utils/recurrenceUtils';
import CustomRecurrenceModal from './CustomRecurrenceModal';

interface InterfaceRecurrenceOptionsProps {
  recurrenceRuleState: InterfaceRecurrenceRuleState;
  recurrenceRuleText: string;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRuleState>,
  ) => void;
  popover: JSX.Element;
  t: (key: string) => string;
}

const RecurrenceOptions: React.FC<InterfaceRecurrenceOptionsProps> = ({
  recurrenceRuleState,
  recurrenceRuleText,
  setRecurrenceRuleState,
  popover,
  t,
}) => {
  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState<boolean>(false);

  const { recurrenceStartDate } = recurrenceRuleState;

  const hideCustomRecurrenceModal = (): void => {
    setCustomRecurrenceModalIsOpen(false);
  };

  return (
    <>
      <Dropdown drop="up" className="mt-2 d-inline-block w-100">
        <Dropdown.Toggle
          variant="outline-secondary"
          className="py-2 border border-secondary-subtle rounded-2"
          id="dropdown-basic"
          data-testid="recurrenceOptions"
        >
          {recurrenceRuleText.length > 45 ? (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="right"
              overlay={popover}
            >
              <span
                className="fw-semibold"
                data-testid="recurrenceRuleTextOverlay"
              >
                {`${recurrenceRuleText.substring(0, 45)}...`}
              </span>
            </OverlayTrigger>
          ) : (
            <span className="fw-semibold">{recurrenceRuleText}</span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="mb-2">
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.DAILY,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="dailyRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText({
                ...recurrenceRuleState,
                frequency: Frequency.DAILY,
              })}
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.WEEKLY,
                weekDays: [Days[recurrenceStartDate.getDay()]],
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="weeklyRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText({
                ...recurrenceRuleState,
                frequency: Frequency.WEEKLY,
                weekDays: [Days[recurrenceStartDate.getDay()]],
              })}
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.MONTHLY,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="monthlyRecurrenceOnThatDay"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText({
                ...recurrenceRuleState,
                frequency: Frequency.MONTHLY,
                weekDayOccurenceInMonth: undefined,
              })}
            </span>
          </Dropdown.Item>
          {getWeekDayOccurenceInMonth(recurrenceStartDate) !== 5 && (
            <Dropdown.Item
              onClick={() =>
                setRecurrenceRuleState({
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: [Days[recurrenceStartDate.getDay()]],
                  weekDayOccurenceInMonth:
                    getWeekDayOccurenceInMonth(recurrenceStartDate),
                })
              }
              data-testid="monthlyRecurrenceOnThatOccurence"
            >
              <span className="fw-semibold text-secondary">
                {getRecurrenceRuleText({
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: [Days[recurrenceStartDate.getDay()]],
                  weekDayOccurenceInMonth:
                    getWeekDayOccurenceInMonth(recurrenceStartDate),
                })}
              </span>
            </Dropdown.Item>
          )}
          {isLastOccurenceOfWeekDay(recurrenceStartDate) && (
            <Dropdown.Item
              onClick={() =>
                setRecurrenceRuleState({
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: [Days[recurrenceStartDate.getDay()]],
                  weekDayOccurenceInMonth: -1,
                })
              }
              data-testid="monthlyRecurrenceOnLastOccurence"
            >
              <span className="fw-semibold text-secondary">
                {getRecurrenceRuleText({
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: [Days[recurrenceStartDate.getDay()]],
                  weekDayOccurenceInMonth: -1,
                })}
              </span>
            </Dropdown.Item>
          )}
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.YEARLY,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="yearlyRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText({
                ...recurrenceRuleState,
                frequency: Frequency.YEARLY,
                weekDayOccurenceInMonth: undefined,
              })}
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.WEEKLY,
                weekDays: mondayToFriday,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="mondayToFridayRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText({
                ...recurrenceRuleState,
                frequency: Frequency.WEEKLY,
                weekDays: mondayToFriday,
              })}
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setCustomRecurrenceModalIsOpen(true)}
            data-testid="customRecurrence"
          >
            <span className="fw-semibold text-body-tertiary">Custom...</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Custom Recurrence Modal */}
      <CustomRecurrenceModal
        recurrenceRuleState={recurrenceRuleState}
        recurrenceRuleText={recurrenceRuleText}
        setRecurrenceRuleState={setRecurrenceRuleState}
        customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
        hideCustomRecurrenceModal={hideCustomRecurrenceModal}
        setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
        t={t}
      />
    </>
  );
};

export default RecurrenceOptions;
