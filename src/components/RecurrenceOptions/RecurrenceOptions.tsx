import React from 'react';
import { Dropdown, OverlayTrigger } from 'react-bootstrap';
import {
  Days,
  Frequency,
  type InterfaceRecurrenceRule,
  getRecurrenceRuleText,
  getWeekDayOccurenceInMonth,
  isLastOccurenceOfWeekDay,
  mondayToFriday,
} from 'utils/recurrenceUtils';

interface InterfaceRecurrenceOptionsProps {
  recurrenceRuleState: InterfaceRecurrenceRule;
  recurrenceRuleText: string;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  startDate: Date;
  endDate: Date | null;
  setCustomRecurrenceModalIsOpen: (
    state: React.SetStateAction<boolean>,
  ) => void;
  popover: JSX.Element;
}

const RecurrenceOptions: React.FC<InterfaceRecurrenceOptionsProps> = ({
  recurrenceRuleState,
  recurrenceRuleText,
  setRecurrenceRuleState,
  startDate,
  endDate,
  setCustomRecurrenceModalIsOpen,
  popover,
}) => {
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
                weekDays: undefined,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="dailyRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText(
                {
                  ...recurrenceRuleState,
                  frequency: Frequency.DAILY,
                },
                startDate,
                endDate,
              )}
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.WEEKLY,
                weekDays: [Days[startDate.getDay()]],
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="weeklyRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText(
                {
                  ...recurrenceRuleState,
                  frequency: Frequency.WEEKLY,
                  weekDays: [Days[startDate.getDay()]],
                },
                startDate,
                endDate,
              )}
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.MONTHLY,
                weekDays: undefined,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="monthlyRecurrenceOnThatDay"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText(
                {
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: undefined,
                  weekDayOccurenceInMonth: undefined,
                },
                startDate,
                endDate,
              )}
            </span>
          </Dropdown.Item>
          {getWeekDayOccurenceInMonth(startDate) !== 5 && (
            <Dropdown.Item
              onClick={() =>
                setRecurrenceRuleState({
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: [Days[startDate.getDay()]],
                  weekDayOccurenceInMonth:
                    getWeekDayOccurenceInMonth(startDate),
                })
              }
              data-testid="monthlyRecurrenceOnThatOccurence"
            >
              <span className="fw-semibold text-secondary">
                {getRecurrenceRuleText(
                  {
                    ...recurrenceRuleState,
                    frequency: Frequency.MONTHLY,
                    weekDays: [Days[startDate.getDay()]],
                    weekDayOccurenceInMonth:
                      getWeekDayOccurenceInMonth(startDate),
                  },
                  startDate,
                  endDate,
                )}
              </span>
            </Dropdown.Item>
          )}
          {isLastOccurenceOfWeekDay(startDate) && (
            <Dropdown.Item
              onClick={() =>
                setRecurrenceRuleState({
                  ...recurrenceRuleState,
                  frequency: Frequency.MONTHLY,
                  weekDays: [Days[startDate.getDay()]],
                  weekDayOccurenceInMonth: -1,
                })
              }
              data-testid="monthlyRecurrenceOnLastOccurence"
            >
              <span className="fw-semibold text-secondary">
                {getRecurrenceRuleText(
                  {
                    ...recurrenceRuleState,
                    frequency: Frequency.MONTHLY,
                    weekDays: [Days[startDate.getDay()]],
                    weekDayOccurenceInMonth: -1,
                  },
                  startDate,
                  endDate,
                )}
              </span>
            </Dropdown.Item>
          )}
          <Dropdown.Item
            onClick={() =>
              setRecurrenceRuleState({
                ...recurrenceRuleState,
                frequency: Frequency.YEARLY,
                weekDays: undefined,
                weekDayOccurenceInMonth: undefined,
              })
            }
            data-testid="yearlyRecurrence"
          >
            <span className="fw-semibold text-secondary">
              {getRecurrenceRuleText(
                {
                  ...recurrenceRuleState,
                  frequency: Frequency.YEARLY,
                  weekDays: undefined,
                  weekDayOccurenceInMonth: undefined,
                },
                startDate,
                endDate,
              )}
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
              {getRecurrenceRuleText(
                {
                  ...recurrenceRuleState,
                  frequency: Frequency.WEEKLY,
                  weekDays: mondayToFriday,
                },
                startDate,
                endDate,
              )}
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
    </>
  );
};

export default RecurrenceOptions;
