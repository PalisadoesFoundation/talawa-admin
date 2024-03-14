import React, { useState } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  Form,
  FormControl,
  Modal,
} from 'react-bootstrap';
import styles from './OrganizationEvents.module.css';
import { DatePicker } from '@mui/x-date-pickers';

const dayMapping = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

interface InterfaceRecurrenceRuleProps {
  recurrenceRuleModalIsOpen: boolean;
  recurringchecked: boolean;
  hideRecurrenceRuleModal: () => void;
  setRecurrenceRuleModalIsOpen: (state: React.SetStateAction<boolean>) => void;
  t: (key: string) => string;
}

const RecurrenceRuleModal: React.FC<InterfaceRecurrenceRuleProps> = ({
  recurrenceRuleModalIsOpen,
  recurringchecked,
  hideRecurrenceRuleModal,
  setRecurrenceRuleModalIsOpen,
  t,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    console.log(selectedOption);
    setSelectedOption(event.target.value);
  };

  const [weekDays, setWeekDays] = useState<string[]>([]);

  const handleDayClick = (day: string): void => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((d) => d !== day));
    } else {
      setWeekDays([...weekDays, day]);
    }
    console.log(weekDays);
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
                Week
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Day</Dropdown.Item>
                <Dropdown.Item>Week</Dropdown.Item>
                <Dropdown.Item>Month</Dropdown.Item>
                <Dropdown.Item>Year</Dropdown.Item>
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
                  className={`${styles.recurrenceDayButton} ${weekDays.includes(dayMapping[index]) ? styles.selected : ''}`}
                  onClick={() => handleDayClick(dayMapping[index])}
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
                      defaultChecked={option === 'Never'}
                    />

                    {option === 'On' && (
                      <div className="ms-3">
                        <DatePicker
                          className={styles.recurrenceRuleDateBox}
                          disabled={selectedOption !== 'On'}
                        />
                      </div>
                    )}
                    {option === 'After' && (
                      <>
                        <FormControl
                          type="number"
                          defaultValue={1}
                          min={1}
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
