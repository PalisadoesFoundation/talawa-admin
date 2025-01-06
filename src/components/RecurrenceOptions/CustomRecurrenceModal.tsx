import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, FormControl, Modal } from 'react-bootstrap';
import styles from '../../style/app.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Days,
  Frequency,
  daysOptions,
  endsAfter,
  endsNever,
  endsOn,
  frequencies,
  getRecurrenceRuleText,
  getWeekDayOccurenceInMonth,
  isLastOccurenceOfWeekDay,
  recurrenceEndOptions,
} from 'utils/recurrenceUtils';
import type {
  InterfaceRecurrenceRuleState,
  RecurrenceEndOption,
  WeekDays,
} from 'utils/recurrenceUtils';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/**
 * Props for the CustomRecurrenceModal component.
 */
interface InterfaceCustomRecurrenceModalProps {
  recurrenceRuleState: InterfaceRecurrenceRuleState;
  recurrenceRuleText: string;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRuleState>,
  ) => void;
  customRecurrenceModalIsOpen: boolean;
  hideCustomRecurrenceModal: () => void;
  setCustomRecurrenceModalIsOpen: (
    state: React.SetStateAction<boolean>,
  ) => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * A modal for setting up custom recurrence rules.
 *
 * This component allows users to configure how often an event should repeat, and
 * when it should end. It includes options for daily, weekly, monthly, and yearly
 * recurrence, as well as specific end options.
 *
 * @param props - The props object containing various configurations and state management functions.
 * @returns The JSX element representing the CustomRecurrenceModal.
 */
const CustomRecurrenceModal: React.FC<InterfaceCustomRecurrenceModalProps> = ({
  recurrenceRuleState,
  recurrenceRuleText,
  setRecurrenceRuleState,
  customRecurrenceModalIsOpen,
  hideCustomRecurrenceModal,
  setCustomRecurrenceModalIsOpen,
  t,
  tCommon,
}) => {
  const {
    recurrenceStartDate,
    recurrenceEndDate,
    frequency,
    weekDays,
    interval,
    count,
  } = recurrenceRuleState;
  const [selectedRecurrenceEndOption, setSelectedRecurrenceEndOption] =
    useState<RecurrenceEndOption>(endsNever);

  useEffect(() => {
    if (recurrenceEndDate) {
      setSelectedRecurrenceEndOption(endsOn);
    } else if (count) {
      setSelectedRecurrenceEndOption(endsAfter);
    }
  }, [recurrenceRuleState]);

  /**
   * Handles changes to the recurrence end option.
   *
   * Updates the recurrence rule state based on the selected option.
   *
   * @param e - The event object from the radio button change.
   */
  const handleRecurrenceEndOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedRecurrenceEndOption = e.target.value as RecurrenceEndOption;
    setSelectedRecurrenceEndOption(selectedRecurrenceEndOption);
    if (selectedRecurrenceEndOption === endsNever) {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        recurrenceEndDate: null,
        count: undefined,
      });
    }
    if (selectedRecurrenceEndOption === endsOn) {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        recurrenceEndDate: dayjs().add(1, 'month').toDate(),
        count: undefined,
      });
    }
    if (selectedRecurrenceEndOption === endsAfter) {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        recurrenceEndDate: null,
        count: 10,
      });
    }
  };

  /**
   * Handles clicks on day buttons for weekly recurrence.
   *
   * Toggles the selected state of a day button in the weekly recurrence setup.
   *
   * @param day - The day of the week to toggle.
   */
  const handleDayClick = (day: WeekDays): void => {
    if (weekDays !== undefined && weekDays.includes(day)) {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        weekDays: weekDays.filter((d) => d !== day),
        weekDayOccurenceInMonth: undefined,
      });
    } else {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        weekDays: [...(weekDays ?? []), day],
        weekDayOccurenceInMonth: undefined,
      });
    }
  };

  /**
   * Toggles the visibility of the custom recurrence modal.
   */
  const handleCustomRecurrenceSubmit = (): void => {
    setCustomRecurrenceModalIsOpen(!customRecurrenceModalIsOpen);
  };

  return (
    <>
      <Modal
        show={customRecurrenceModalIsOpen}
        onHide={hideCustomRecurrenceModal}
        centered
      >
        <Modal.Header>
          <p className={styles.titlemodalCustomRecurrenceModal}>
            {t('customRecurrence')}
          </p>
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
              value={interval}
              min={1}
              className={`${styles.recurrenceRuleNumberInput} ms-2 d-inline-block py-2`}
              data-testid="customRecurrenceIntervalInput"
              onChange={(e) =>
                setRecurrenceRuleState({
                  ...recurrenceRuleState,
                  interval: Number(e.target.value),
                })
              }
            />
            <Dropdown className="ms-3 d-inline-block">
              <Dropdown.Toggle
                className="py-2"
                variant="outline-secondary"
                id="dropdown-basic"
                data-testid="customRecurrenceFrequencyDropdown"
              >
                {`${frequencies[frequency]}${interval && interval > 1 ? 's' : ''}`}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.DAILY,
                      weekDayOccurenceInMonth: undefined,
                    })
                  }
                  data-testid="customDailyRecurrence"
                >
                  {interval && interval > 1 ? 'Days' : 'Day'}
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
                  data-testid="customWeeklyRecurrence"
                >
                  {interval && interval > 1 ? 'Weeks' : 'Week'}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.MONTHLY,
                      weekDayOccurenceInMonth: undefined,
                    })
                  }
                  data-testid="customMonthlyRecurrence"
                >
                  {interval && interval > 1 ? 'Months' : 'Month'}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.YEARLY,
                      weekDayOccurenceInMonth: undefined,
                    })
                  }
                  data-testid="customYearlyRecurrence"
                >
                  {interval && interval > 1 ? 'Years' : 'Year'}
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
                    className={`${styles.recurrenceDayButton} ${weekDays?.includes(Days[index]) ? styles.selected : ''}`}
                    onClick={() => handleDayClick(Days[index])}
                    data-testid="recurrenceWeekDay"
                  >
                    <span>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {frequency === Frequency.MONTHLY && (
            <div className="mb-4">
              <Dropdown drop="down" className="w-100">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="py-2 border border-secondary-subtle rounded-2"
                  id="dropdown-basic"
                  data-testid="monthlyRecurrenceOptions"
                >
                  <span className="fw-semibold">{recurrenceRuleText}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="mb-2">
                  <Dropdown.Item
                    onClick={() =>
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        frequency: Frequency.MONTHLY,
                        weekDayOccurenceInMonth: undefined,
                      })
                    }
                    data-testid="monthlyRecurrenceOptionOnThatDay"
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
                      data-testid="monthlyRecurrenceOptionOnThatOccurence"
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
                      data-testid="monthlyRecurrenceOptionOnLastOccurence"
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
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}

          <div className="mb-3">
            <span className="fw-semibold text-secondary">{t('ends')}</span>
            <div className="ms-3 mt-3">
              <Form>
                {recurrenceEndOptions.map((option, index) => (
                  <div key={index} className="my-0 d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id={`radio-${index}`}
                      label={t(option)}
                      name="recurrenceEndOption"
                      className="d-inline-block me-5"
                      value={option}
                      onChange={handleRecurrenceEndOptionChange}
                      defaultChecked={option === selectedRecurrenceEndOption}
                      data-testid={`${option}`}
                    />

                    {option === endsOn && (
                      <div className="ms-3">
                        <DatePicker
                          label={tCommon('endDate')}
                          className={styles.recurrenceRuleDateBox}
                          disabled={selectedRecurrenceEndOption !== endsOn}
                          value={dayjs(
                            recurrenceEndDate ?? dayjs().add(1, 'month'),
                          )}
                          onChange={(date: Dayjs | null): void => {
                            /* istanbul ignore next */
                            if (date) {
                              setRecurrenceRuleState({
                                ...recurrenceRuleState,
                                recurrenceEndDate: date?.toDate(),
                              });
                            }
                          }}
                        />
                      </div>
                    )}
                    {option === endsAfter && (
                      <>
                        <FormControl
                          type="number"
                          value={count ?? 10}
                          min={1}
                          onChange={(e) =>
                            setRecurrenceRuleState({
                              ...recurrenceRuleState,
                              count: Number(e.target.value),
                            })
                          }
                          className={`${styles.recurrenceRuleNumberInput} ms-1 me-2 d-inline-block py-2`}
                          disabled={selectedRecurrenceEndOption !== endsAfter}
                          data-testid="customRecurrenceCountInput"
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
              {tCommon('done')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomRecurrenceModal;
