/**
 * RecurrenceOptions Component
 *
 * This component provides a dropdown menu for selecting recurrence options
 * for scheduling events. It supports various recurrence frequencies such as
 * daily, weekly, monthly, and yearly, along with custom recurrence options.
 *
 * @component
 * @param {InterfaceRecurrenceOptionsProps} props - The props for the component.
 * @param {InterfaceRecurrenceRuleState} props.recurrenceRuleState - The current state of the recurrence rule.
 * @param {string} props.recurrenceRuleText - The textual representation of the recurrence rule.
 * @param {(state: React.SetStateAction<InterfaceRecurrenceRuleState>) => void} props.setRecurrenceRuleState -
 * A function to update the recurrence rule state.
 * @param {JSX.Element} props.popover - A popover element for displaying additional information.
 * @param {(key: string) => string} props.t - Translation function for localized strings.
 * @param {(key: string) => string} props.tCommon - Common translation function for shared localized strings.
 *
 * @returns {JSX.Element} The rendered RecurrenceOptions component.
 *
 * @remarks
 * - The dropdown menu includes predefined recurrence options such as daily, weekly, monthly, and yearly.
 * - It also supports custom recurrence rules through a modal dialog.
 * - The component uses utility functions like `getRecurrenceRuleText`, `getWeekDayOccurenceInMonth`,
 *   and `isLastOccurenceOfWeekDay` to determine recurrence details.
 *
 * @example
 * ```tsx
 * <RecurrenceOptions
 *   recurrenceRuleState={recurrenceRuleState}
 *   recurrenceRuleText={recurrenceRuleText}
 *   setRecurrenceRuleState={setRecurrenceRuleState}
 *   popover={<PopoverContent />}
 *   t={translate}
 *   tCommon={commonTranslate}
 * />
 * ```
 */
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
import CustomRecurrenceModal from './Modal/CustomRecurrenceModal';

interface InterfaceRecurrenceOptionsProps {
  recurrenceRuleState: InterfaceRecurrenceRuleState;
  recurrenceRuleText: string;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRuleState>,
  ) => void;
  popover: JSX.Element;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const RecurrenceOptions: React.FC<InterfaceRecurrenceOptionsProps> = ({
  recurrenceRuleState,
  recurrenceRuleText,
  setRecurrenceRuleState,
  popover,
  t,
  tCommon,
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
        tCommon={tCommon}
      />
    </>
  );
};

export default RecurrenceOptions;
