import React, { useState } from 'react';
import { Button, Dropdown, Form, FormControl, Modal } from 'react-bootstrap';
import styles from './OrganizationEvents.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import { Days, Frequency, frequencies } from 'utils/recurrenceRuleUtils';
import type { WeekDays } from 'utils/recurrenceRuleUtils';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface InterfaceRecurrenceRuleProps {
  frequency: Frequency;
  setFrequency: (state: React.SetStateAction<Frequency>) => void;
  weekDays: WeekDays[];
  setWeekDays: (state: React.SetStateAction<WeekDays[]>) => void;
  setCount: (state: React.SetStateAction<number | undefined>) => void;
  endDate: Date | null;
  setEndDate: (state: React.SetStateAction<Date | null>) => void;
  recurrenceRuleModalIsOpen: boolean;
  recurringchecked: boolean;
  hideRecurrenceRuleModal: () => void;
  setRecurrenceRuleModalIsOpen: (state: React.SetStateAction<boolean>) => void;
  t: (key: string) => string;
}

const RecurrenceRuleModal: React.FC<InterfaceRecurrenceRuleProps> = ({
  frequency,
  setFrequency,
  weekDays,
  setWeekDays,
  setCount,
  endDate,
  setEndDate,
  recurrenceRuleModalIsOpen,
  recurringchecked,
  hideRecurrenceRuleModal,
  setRecurrenceRuleModalIsOpen,
  t,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('On');

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const endsOnOption = e.target.value;
    setSelectedOption(endsOnOption);
    if (endsOnOption === 'Never') {
      setCount(undefined);
      setEndDate(null);
    }
    if (endsOnOption === 'On') {
      setCount(undefined);
    }
    if (endsOnOption === 'After') {
      setEndDate(null);
    }
  };

  const handleDayClick = (day: WeekDays): void => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((d) => d !== day));
    } else {
      setWeekDays([...weekDays, day]);
    }
  };

  const handleRecurrenceRuleSubmit = (): void => {
    setRecurrenceRuleModalIsOpen(!recurrenceRuleModalIsOpen);
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const options = ['Never', 'On', 'After'];

  return (
    <>
      <Modal
        show={recurrenceRuleModalIsOpen && recurringchecked}
        onHide={hideRecurrenceRuleModal}
        centered
      >
        <Modal.Header>
          <p className={styles.titlemodal}>
            {/* {t('eventDetails')} */}
            Custom recurrence
          </p>
          <Button
            variant="danger"
            onClick={hideRecurrenceRuleModal}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body className="pb-2">
          <div className="mb-4">
            <span className="fw-semibold text-secondary">Repeats every</span>{' '}
            <FormControl
              type="number"
              defaultValue={1}
              min={1}
              className={`${styles.recurrenceRuleNumberInput} ms-2 d-inline-block py-2`}
            />
            <Dropdown className="ms-3 d-inline-block">
              <Dropdown.Toggle
                className="py-2"
                variant="outline-secondary"
                id="dropdown-basic"
              >
                {frequencies[frequency]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFrequency(Frequency.DAILY)}>
                  Day
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFrequency(Frequency.WEEKLY)}>
                  Week
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFrequency(Frequency.MONTHLY)}>
                  Month
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFrequency(Frequency.YEARLY)}>
                  Year
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mb-4">
            <span className="fw-semibold text-secondary">Repeats on</span>
            <br />
            <div className="mx-2 mt-3 d-flex gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`${styles.recurrenceDayButton} ${weekDays.includes(Days[index]) ? styles.selected : ''}`}
                  onClick={() => handleDayClick(Days[index])}
                >
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <span className="fw-semibold text-secondary">Ends</span>
            <div className="ms-3 mt-3">
              <Form>
                {options.map((option, index) => (
                  <div key={index} className="my-0 d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id={`radio-${index}`}
                      label={option}
                      name="recurrenceEnd"
                      className="d-inline-block me-5"
                      value={option}
                      onChange={handleOptionChange}
                      defaultChecked={option === 'On'}
                    />

                    {option === 'On' && (
                      <div className="ms-3">
                        <DatePicker
                          className={styles.recurrenceRuleDateBox}
                          disabled={selectedOption !== 'On'}
                          value={dayjs(endDate ?? new Date())}
                          onChange={(date: Dayjs | null): void => {
                            if (date) {
                              setEndDate(date?.toDate());
                            }
                          }}
                        />
                      </div>
                    )}
                    {option === 'After' && (
                      <>
                        <FormControl
                          type="number"
                          defaultValue={1}
                          min={1}
                          onChange={(e) => setCount(Number(e.target.value))}
                          className={`${styles.recurrenceRuleNumberInput} ms-1 me-2 d-inline-block py-2`}
                          disabled={selectedOption !== 'After'}
                        />{' '}
                        occurrences
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
              value="createevent"
              data-testid="createEventBtn"
              onClick={handleRecurrenceRuleSubmit}
            >
              {/* {t('createEvent')} */}
              Done
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RecurrenceRuleModal;
