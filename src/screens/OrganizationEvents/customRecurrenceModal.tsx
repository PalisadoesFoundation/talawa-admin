import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, FormControl, Modal } from 'react-bootstrap';
import styles from './OrganizationEvents.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import { Days, Frequency, frequencies } from 'utils/recurrenceRuleUtils';
import type {
  InterfaceRecurrenceRule,
  WeekDays,
} from 'utils/recurrenceRuleUtils';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const daysOptions = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const endsOnOptions = ['Never', 'On', 'After'];

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
  const [endsOnOption, setEndsOnOption] = useState<string>('Never');

  useEffect(() => {
    if (endDate) {
      setEndsOnOption('On');
    }
  }, [endDate]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const endsOnOption = e.target.value;
    setEndsOnOption(endsOnOption);
    if (endsOnOption === 'Never') {
      setEndDate(null);
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        count: undefined,
      });
    }
    if (endsOnOption === 'On') {
      setRecurrenceRuleState({
        ...recurrenceRuleState,
        count: undefined,
      });
    }
    if (endsOnOption === 'After') {
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

  const handleRecurrenceRuleSubmit = (): void => {
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
          <p className={styles.titlemodal}>Custom recurrence</p>
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
                <Dropdown.Item
                  onClick={() =>
                    setRecurrenceRuleState({
                      ...recurrenceRuleState,
                      frequency: Frequency.DAILY,
                    })
                  }
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
                >
                  Year
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {frequency === Frequency.WEEKLY && (
            <div className="mb-4">
              <span className="fw-semibold text-secondary">Repeats on</span>
              <br />
              <div className="mx-2 mt-3 d-flex gap-1">
                {daysOptions.map((day, index) => (
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
          )}

          <div className="mb-3">
            <span className="fw-semibold text-secondary">Ends</span>
            <div className="ms-3 mt-3">
              <Form>
                {endsOnOptions.map((option, index) => (
                  <div key={index} className="my-0 d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id={`radio-${index}`}
                      label={option}
                      name="recurrenceEnd"
                      className="d-inline-block me-5"
                      value={option}
                      onChange={handleOptionChange}
                      defaultChecked={option === endsOnOption}
                    />

                    {option === 'On' && (
                      <div className="ms-3">
                        <DatePicker
                          className={styles.recurrenceRuleDateBox}
                          disabled={endsOnOption !== 'On'}
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
                          onChange={(e) =>
                            setRecurrenceRuleState({
                              ...recurrenceRuleState,
                              count: Number(e.target.value),
                            })
                          }
                          className={`${styles.recurrenceRuleNumberInput} ms-1 me-2 d-inline-block py-2`}
                          disabled={endsOnOption !== 'After'}
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
              data-testid="customRecurrenceBtn"
              onClick={handleRecurrenceRuleSubmit}
            >
              Done
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomRecurrenceModal;
