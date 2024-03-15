/*eslint-disable*/
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { type ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions } from 'utils/currency';
import { InterfaceCreatePledge } from 'utils/interfaces';
import styles from './FundCampaignPledge.module.css';

interface InterfaceCreatePledgeModal {
  createCamapignModalIsOpen: boolean;
  hideCreateCampaignModal: () => void;
  formState: InterfaceCreatePledge;
  setFormState: (state: React.SetStateAction<InterfaceCreatePledge>) => void;
  createPledgeHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  startDate: Date;
  endDate: Date;
}

const PledgeCreateModal: React.FC<InterfaceCreatePledgeModal> = ({
  createCamapignModalIsOpen,
  hideCreateCampaignModal,
  formState,
  setFormState,
  createPledgeHandler,
  startDate,
  endDate,
}) => {
  return (
    <>
      <Modal
        className={styles.pledgeModal}
        onHide={hideCreateCampaignModal}
        show={createCamapignModalIsOpen}
      >
        <Modal.Header>
          <p className={styles.titlemodal}> Create Pledge</p>
          <Button
            variant="danger"
            onClick={hideCreateCampaignModal}
            data-testid="createCampaignCloseBtn"
          >
            {' '}
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createPledgeHandler}>
            <Form.Group className="d-flex flex-column mx-auto  mb-3">
              <div className="mb-4">
                <DatePicker
                  label="Start Date"
                  value={dayjs(startDate)}
                  className="me-4 "
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setFormState({
                        ...formState,
                        pledgeStartDate: date.toDate(),
                        pledgeEndDate:
                          formState.pledgeEndDate &&
                          (formState.pledgeEndDate < date?.toDate()
                            ? date.toDate()
                            : formState.pledgeEndDate),
                      });
                    }
                  }}
                  minDate={dayjs(startDate)}
                />
              </div>
              <div>
                <DatePicker
                  label="End Date"
                  value={dayjs(endDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setFormState({
                        ...formState,
                        pledgeEndDate: date.toDate(),
                      });
                    }
                  }}
                  minDate={dayjs(startDate)}
                />
              </div>
            </Form.Group>
            <Form.Group className="d-flex mx-auto">
              <Form.Group>
                <Form.Label className="">Currency</Form.Label>
                <div>
                  <Form.Control
                    as="select"
                    value={formState.pledgeCurrency}
                    size="sm"
                    className="w-50 "
                    data-testid="currencySelect"
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        pledgeCurrency: e.target.value,
                      });
                    }}
                  >
                    <option value="" disabled>
                      Select Currency
                    </option>
                    {currencyOptions.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Form.Group>
              <Form.Group className="me-auto">
                <Form.Label> Amount </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Funding Goal"
                  value={formState.pledgeAmount}
                  className="p-1 "
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 0) {
                      setFormState({
                        ...formState,
                        pledgeAmount: parseInt(e.target.value),
                      });
                    }
                  }}
                />
              </Form.Group>
            </Form.Group>
            <Button
              type="submit"
              className={styles.greenregbtn}
              data-testid="createCampaignBtn"
            >
              Create Pledge
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PledgeCreateModal;
