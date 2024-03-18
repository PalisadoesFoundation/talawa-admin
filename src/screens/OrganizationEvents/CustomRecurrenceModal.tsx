import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, FormControl, Modal } from 'react-bootstrap';
import styles from './OrganizationEvents.module.css';
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
} from 'utils/recurrenceUtils';
import type {
  InterfaceRecurrenceRule,
  RecurrenceEndOption,
  WeekDays,
} from 'utils/recurrenceUtils';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface InterfaceCustomRecurrenceModalProps {
  recurrenceRuleState: InterfaceRecurrenceRule;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  endDate: Date | null;
  setEndDate: (state: React.SetStateAction<Date | null>) => void;
  customRecurrenceModalIsOpen: boolean;
  hideCustomRecurrenceModal: () => void;
  setCustomRecurrenceModalIsOpen: (
    state: React.SetStateAction<boolean>,
  ) => void;
  t: (key: string) => string;
}

const CustomRecurrenceModal: React.FC<InterfaceCustomRecurrenceModalProps> = ({
  recurrenceRuleState,
  setRecurrenceRuleState,
  endDate,
  setEndDate,
  customRecurrenceModalIsOpen,
  hideCustomRecurrenceModal,
  setCustomRecurrenceModalIsOpen,
  t,
}) => {
  const { frequency, weekDays } = recurrenceRuleState;
  const [selectedRecurrenceEndOption, setSelectedRecurrenceEndOption] =
    useState<RecurrenceEndOption>(endsNever);

  useEffect(() => {
    if (endDate) {
      setSelectedRecurrenceEndOption(endsOn);
    }
  }, [endDate]);

  const handleRecurrenceEndOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedRecurrenceEndOption = e.target.value as RecurrenceEndOption;
    setSelectedRecurrenceEndOption(selectedRecurrenceEndOption);
    if (selectedRecurrenceEndOption === endsNever) {
      setEndDate(null);
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        count: undefined,
      });
    }
    if (selectedRecurrenceEndOption === endsOn) {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        count: undefined,
      });
    }
    if (selectedRecurrenceEndOption === endsAfter) {
      setEndDate(null);
    }
  };

  const handleDayClick = (day: WeekDays): void => {
    if (weekDays.includes(day)) {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        weekDays: weekDays.filter((d) => d !== day),
      });
    } else {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        weekDays: [...weekDays, day],
      });
    }
  };

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
              defaultValue={1}
              min={1}
              className={`${styles.recurrenceRuleNumberInput} ms-2 d-inline-block py-2`}
              data-testid="customRecurrenceIntervalInput"
            />
            <Dropdown className="ms-3 d-inline-block">
              <Dropdown.Toggle
                className="py-2"
                variant="outline-secondary"
                id="dropdown-basic"
                data-testid="customRecurrenceFrequencyDropdown"
              >
                {frequencies[frequency]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.DAILY,
                    })
                  }
                  data-testid="customDailyRecurrence"
                >
                  Day
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.WEEKLY,
                    })
                  }
                  data-testid="customWeeklyRecurrence"
                >
                  Week
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.MONTHLY,
                    })
                  }
                  data-testid="customMonthlyRecurrence"
                >
                  Month
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.YEARLY,
                    })
                  }
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
                    className={`${styles.recurrenceDayButton} ${weekDays.includes(Days[index]) ? styles.selected : ''}`}
                    onClick={() => handleDayClick(Days[index])}
                    data-testid="recurrenceWeekDay"
                  >
                    <span>{day}</span>
                  </div>
                ))}
              </div>
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
                          label={t('endDate')}
                          className={styles.recurrenceRuleDateBox}
                          disabled={selectedRecurrenceEndOption !== endsOn}
                          value={dayjs(endDate ?? new Date())}
                          onChange={(date: Dayjs | null): void => {
                            /* istanbul ignore next */
                            if (date) {
                              setEndDate(date?.toDate());
                            }
                          }}
                        />
                      </div>
                    )}
                    {option === endsAfter && (
                      <>
                        <FormControl
                          type="number"
                          defaultValue={1}
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
              {t('done')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomRecurrenceModal;
