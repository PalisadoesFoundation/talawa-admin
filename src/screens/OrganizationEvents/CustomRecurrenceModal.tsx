import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Dropdown, Form, FormControl, Modal } from 'react-bootstrap';
import styles from '../../style/app-fixed.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Days,
  Frequency,
  daysOptions,
  endsAfter,
  endsNever,
  endsOn,
  frequencies,
  recurrenceEndOptions,
  monthNames,
} from '../../utils/recurrenceUtils';
import type {
  InterfaceRecurrenceRule,
  RecurrenceEndOptionType,
  WeekDays,
} from '../../utils/recurrenceUtils';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/**
 * Props interface for the CustomRecurrenceModal component
 */
interface InterfaceCustomRecurrenceModalProps {
  /** Current recurrence rule state */
  recurrenceRuleState: InterfaceRecurrenceRule;
  /** Function to update recurrence rule state */
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  /** Event end date */
  endDate: Date | null;
  /** Function to set event end date */
  setEndDate: (state: React.SetStateAction<Date | null>) => void;
  /** Whether the custom recurrence modal is open */
  customRecurrenceModalIsOpen: boolean;
  /** Function to hide the custom recurrence modal */
  hideCustomRecurrenceModal: () => void;
  /** Function to set custom recurrence modal open state */
  setCustomRecurrenceModalIsOpen: (
    state: React.SetStateAction<boolean>,
  ) => void;
  /** Translation function */
  t: (key: string) => string;
  /** Event start date */
  startDate: Date;
}

const CustomRecurrenceModal: React.FC<InterfaceCustomRecurrenceModalProps> = ({
  recurrenceRuleState,
  setRecurrenceRuleState,
  endDate,
  customRecurrenceModalIsOpen,
  hideCustomRecurrenceModal,
  setCustomRecurrenceModalIsOpen,
  t,
  startDate,
}) => {
  const { frequency, byDay, interval = 1, count, never } = recurrenceRuleState;
  const [selectedRecurrenceEndOption, setSelectedRecurrenceEndOption] =
    useState<RecurrenceEndOptionType>(() => {
      // Initialize based on current recurrence state
      if (never) return endsNever;
      if (recurrenceRuleState.endDate) return endsOn;
      if (count) return endsAfter;
      // Default to "after" for yearly frequency, "never" for others
      return frequency === Frequency.YEARLY ? endsAfter : endsNever;
    });

  const [localInterval, setLocalInterval] = useState<number | string>(interval);
  const [localCount, setLocalCount] = useState<number | string>(
    count || (frequency === Frequency.YEARLY ? 5 : 1),
  );

  /**
   * Calculates which week of the month a given date falls in
   * @param date - The date to calculate the week for
   * @returns The week number (1-5) within the month
   */
  const getWeekOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekNumber = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
    return weekNumber;
  };

  /**
   * Converts a number to its ordinal string representation
   * @param num - The number to convert (1-5)
   * @returns The ordinal string (e.g., "first", "second", etc.)
   */
  const getOrdinalString = (num: number): string => {
    const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
    return ordinals[num] || 'last';
  };

  /**
   * Gets the full day name from a day index
   * @param dayIndex - The day index (0-6, where 0 is Sunday)
   * @returns The full day name
   */
  const getDayName = (dayIndex: number): string => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayIndex];
  };

  /**
   * Generates monthly recurrence options based on the start date
   * @returns Object containing monthly recurrence display strings and values
   */
  const getMonthlyOptions = () => {
    const eventDate = new Date(startDate);
    const dayOfMonth = eventDate.getDate();
    const dayOfWeek = eventDate.getDay();
    const weekOfMonth = getWeekOfMonth(eventDate);

    return {
      byDate: `Monthly on day ${dayOfMonth}`,
      byWeekday: `Monthly on the ${getOrdinalString(weekOfMonth)} ${getDayName(dayOfWeek)}`,
      dateValue: dayOfMonth,
      weekdayValue: { week: weekOfMonth, day: Days[dayOfWeek] },
    };
  };

  useEffect(() => {
    // Update selected end option when recurrence rule's endDate changes
    if (recurrenceRuleState.endDate && !never && !count) {
      setSelectedRecurrenceEndOption(endsOn);
    }
  }, [recurrenceRuleState.endDate, never, count]);

  /**
   * Handles changes to the recurrence end option (never, on date, after count)
   * @param e - The change event from the radio button input
   */
  const handleRecurrenceEndOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedOption = e.target.value as RecurrenceEndOptionType;
    setSelectedRecurrenceEndOption(selectedOption);
    if (selectedOption === endsNever) {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        never: true,
        count: undefined,
        endDate: undefined,
      }));
    } else if (selectedOption === endsOn) {
      const defaultRecurrenceEndDate = endDate
        ? new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      setRecurrenceRuleState((prev) => ({
        ...prev,
        never: false,
        count: undefined,
        endDate: defaultRecurrenceEndDate,
      }));
    } else if (selectedOption === endsAfter) {
      const totalCount =
        typeof localCount === 'string' ? parseInt(localCount) : localCount;
      setRecurrenceRuleState((prev) => ({
        ...prev,
        never: false,
        endDate: undefined,
        count: totalCount,
      }));
    }
  };

  /**
   * Handles changes to the recurrence frequency (daily, weekly, monthly, yearly)
   * @param newFrequency - The new frequency to set
   */
  const handleFrequencyChange = (newFrequency: Frequency): void => {
    const eventDate = new Date(startDate);
    const currentDay = Days[eventDate.getDay()];
    const currentMonth = eventDate.getMonth() + 1;
    const currentMonthDay = eventDate.getDate();

    let updatedRule: Partial<InterfaceRecurrenceRule> = {
      frequency: newFrequency,
      byDay: undefined,
      byMonth: undefined,
      byMonthDay: undefined,
    };
    switch (newFrequency) {
      case Frequency.WEEKLY:
        updatedRule.byDay = [currentDay];
        break;
      case Frequency.MONTHLY:
        updatedRule.byMonthDay = [currentMonthDay];
        break;
      case Frequency.YEARLY:
        updatedRule.byMonth = [currentMonth];
        updatedRule.byMonthDay = [currentMonthDay];
        updatedRule.count = 5;
        updatedRule.never = false;
        updatedRule.endDate = undefined;
        break;
      case Frequency.DAILY:
      default:
        break;
    }

    setRecurrenceRuleState((prev) => ({
      ...prev,
      ...updatedRule,
    }));

    if (newFrequency === Frequency.YEARLY) {
      setSelectedRecurrenceEndOption(endsAfter);
      setLocalCount(5);
    }
  };

  /**
   * Handles changes to the recurrence interval (every N days/weeks/months/years)
   * @param e - The change event from the interval input
   */
  const handleIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue = e.target.value;
    setLocalInterval(inputValue);

    const newInterval = Math.max(1, parseInt(inputValue) || 1);
    setRecurrenceRuleState((prev) => ({
      ...prev,
      interval: newInterval,
    }));
  };

  /**
   * Handles changes to the occurrence count for "ends after" option
   * @param e - The change event from the count input
   */
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setLocalCount(inputValue);

    if (selectedRecurrenceEndOption === endsAfter) {
      const newCount = Math.max(1, parseInt(inputValue) || 1);
      setRecurrenceRuleState((prev) => ({
        ...prev,
        count: newCount,
        never: false,
        endDate: undefined,
      }));
    }
  };

  /**
   * Handles clicking on day buttons for weekly recurrence
   * @param day - The day that was clicked
   */
  const handleDayClick = (day: WeekDays): void => {
    if (byDay?.includes(day)) {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byDay: byDay.filter((d) => d !== day),
      }));
    } else {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byDay: [...(byDay || []), day],
      }));
    }
  };

  /**
   * Handles submission of the custom recurrence modal
   * Validates inputs and updates the recurrence rule state
   */
  const handleCustomRecurrenceSubmit = (): void => {
    let finalRule = { ...recurrenceRuleState };

    const parsedInterval =
      typeof localInterval === 'string'
        ? parseInt(localInterval)
        : localInterval;
    if (isNaN(parsedInterval) || parsedInterval < 1) {
      console.error('Invalid interval:', localInterval);
      return;
    }
    finalRule.interval = parsedInterval;

    if (selectedRecurrenceEndOption === endsNever) {
      finalRule = {
        ...finalRule,
        never: true,
        count: undefined,
        endDate: undefined,
      };
    } else if (selectedRecurrenceEndOption === endsOn) {
      const recurrenceEndDate =
        recurrenceRuleState.endDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      finalRule = {
        ...finalRule,
        never: false,
        count: undefined,
        endDate: recurrenceEndDate,
      };
    } else if (selectedRecurrenceEndOption === endsAfter) {
      const parsedCount =
        typeof localCount === 'string' ? parseInt(localCount) : localCount;
      if (isNaN(parsedCount) || parsedCount < 1) {
        console.error('Invalid count:', localCount);
        return;
      }

      finalRule = {
        ...finalRule,
        never: false,
        endDate: undefined,
        count: parsedCount,
      };
    }

    setRecurrenceRuleState(finalRule);
    setCustomRecurrenceModalIsOpen(false);
  };

  return (
    <>
      <Modal
        show={customRecurrenceModalIsOpen}
        onHide={hideCustomRecurrenceModal}
        centered
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('customRecurrence')}</p>
          <Button
            variant="danger"
            onClick={hideCustomRecurrenceModal}
            data-testid="customRecurrenceModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body className="pb-2">
          <div className="mb-4">
            <span className="fw-semibold text-secondary">
              {t('repeatsEvery')}
            </span>{' '}
            <FormControl
              type="number"
              value={localInterval}
              onChange={handleIntervalChange}
              onDoubleClick={(e) => {
                (e.target as HTMLInputElement).select();
              }}
              onKeyDown={(e) => {
                if (
                  e.key === '-' ||
                  e.key === '+' ||
                  e.key === 'e' ||
                  e.key === 'E'
                ) {
                  e.preventDefault();
                }
              }}
              min="1"
              className={`${styles.recurrenceRuleNumberInput} ms-2 d-inline-block py-2`}
              data-testid="customRecurrenceIntervalInput"
              placeholder="1"
            />
            <Dropdown className="ms-3 d-inline-block">
              <Dropdown.Toggle
                className={`${styles.dropdown}`}
                variant="outline-secondary"
                id="dropdown-basic"
                data-testid="customRecurrenceFrequencyDropdown"
              >
                {frequencies[frequency]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleFrequencyChange(Frequency.DAILY)}
                  data-testid="customDailyRecurrence"
                >
                  Day
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleFrequencyChange(Frequency.WEEKLY)}
                  data-testid="customWeeklyRecurrence"
                >
                  Week
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleFrequencyChange(Frequency.MONTHLY)}
                  data-testid="customMonthlyRecurrence"
                >
                  Month
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleFrequencyChange(Frequency.YEARLY)}
                  data-testid="customYearlyRecurrence"
                >
                  Year
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {frequency === Frequency.WEEKLY && (
            <div className="mb-4">
              <span className="fw-semibold text-secondary">
                {t('repeatsOn')}
              </span>
              <br />
              <div className="mx-2 mt-3 d-flex gap-1">
                {daysOptions.map((day, index) => (
                  <div
                    key={index}
                    className={`${styles.recurrenceDayButton} ${byDay?.includes(Days[index]) ? styles.selected : ''}`}
                    onClick={() => handleDayClick(Days[index])}
                    data-testid="recurrenceWeekDay"
                  >
                    <span>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Options */}
          {frequency === Frequency.MONTHLY && (
            <div className="mb-4">
              <span className="fw-semibold text-secondary">
                {t('monthlyOn')}
              </span>
              <br />
              <div className="mx-2 mt-3">
                <Dropdown className="d-inline-block">
                  <Dropdown.Toggle
                    className="py-2"
                    variant="outline-secondary"
                    id="monthly-dropdown"
                    data-testid="monthlyRecurrenceDropdown"
                  >
                    {recurrenceRuleState.byDay
                      ? getMonthlyOptions().byWeekday
                      : getMonthlyOptions().byDate}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        const options = getMonthlyOptions();
                        setRecurrenceRuleState((prev) => ({
                          ...prev,
                          byMonthDay: [options.dateValue],
                          byDay: undefined,
                        }));
                      }}
                      data-testid="monthlyByDate"
                    >
                      {getMonthlyOptions().byDate}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          )}

          {/* Yearly Options */}
          {frequency === Frequency.YEARLY && (
            <div className="mb-4">
              <span className="fw-semibold text-secondary">
                {t('yearlyOn')}
              </span>
              <br />
              <div className="mx-2 mt-3">
                <span className="text-muted">
                  {monthNames[new Date(startDate).getMonth()]}{' '}
                  {new Date(startDate).getDate()}
                </span>
                <p className="small mt-1 text-muted mb-0">
                  {t('yearlyRecurrenceDesc')}
                </p>
              </div>
            </div>
          )}

          <div className="mb-3">
            <span className="fw-semibold text-secondary">{t('ends')}</span>
            <div className="ms-3 mt-3">
              <Form>
                {recurrenceEndOptions
                  .filter(
                    (option) =>
                      frequency !== Frequency.YEARLY || option !== endsNever,
                  )
                  .map((option, index) => (
                    <div key={index} className="my-2 d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        id={`radio-${index}`}
                        label={t(option)}
                        name="recurrenceEndOption"
                        className="d-inline-block me-5"
                        value={option}
                        onChange={handleRecurrenceEndOptionChange}
                        checked={option === selectedRecurrenceEndOption}
                        data-testid={`${option}`}
                      />

                      {option === endsOn && (
                        <div className="ms-3">
                          <DatePicker
                            label={t('endDate')}
                            className={styles.recurrenceRuleDateBox}
                            disabled={selectedRecurrenceEndOption !== endsOn}
                            value={dayjs(
                              recurrenceRuleState.endDate ?? new Date(),
                            )}
                            onChange={(date: Dayjs | null): void => {
                              if (date) {
                                const newRecurrenceEndDate = date.toDate();
                                setRecurrenceRuleState((prev) => ({
                                  ...prev,
                                  endDate: newRecurrenceEndDate,
                                  never: false,
                                  count: undefined,
                                }));
                              }
                            }}
                            minDate={dayjs()}
                          />
                        </div>
                      )}
                      {option === endsAfter && (
                        <>
                          <FormControl
                            type="number"
                            value={localCount}
                            onChange={handleCountChange}
                            onDoubleClick={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === '-' ||
                                e.key === '+' ||
                                e.key === 'e' ||
                                e.key === 'E'
                              ) {
                                e.preventDefault();
                              }
                            }}
                            min="1"
                            className={`${styles.recurrenceRuleNumberInput} ms-1 me-2 d-inline-block py-2`}
                            disabled={selectedRecurrenceEndOption !== endsAfter}
                            data-testid="customRecurrenceCountInput"
                            placeholder="1"
                          />{' '}
                          {t('occurences')}
                        </>
                      )}
                    </div>
                  ))}
              </Form>
            </div>
          </div>

          <hr className="mt-4 mb-2 mx-2" />

          <div className="mx w-100 position-relative">
            <Button
              className={styles.recurrenceRuleSubmitBtn}
              data-testid="customRecurrenceSubmitBtn"
              onClick={handleCustomRecurrenceSubmit}
            >
              {t('done')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomRecurrenceModal;
