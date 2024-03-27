import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { type ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions } from 'utils/currency';
import type { InterfaceCreatePledge } from 'utils/interfaces';
import styles from './FundCampaignPledge.module.css';
import React from 'react';

interface InterfaceCreatePledgeModal {
  createCamapignModalIsOpen: boolean;
  hideCreateCampaignModal: () => void;
  formState: InterfaceCreatePledge;
  setFormState: (state: React.SetStateAction<InterfaceCreatePledge>) => void;
  createPledgeHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  startDate: Date;
  endDate: Date;
  t: (key: string) => string;
}

const PledgeCreateModal: React.FC<InterfaceCreatePledgeModal> = ({
  createCamapignModalIsOpen,
  hideCreateCampaignModal,
  formState,
  setFormState,
  createPledgeHandler,
  startDate,
  endDate,
  t,
}) => {
  return (
    <>
      <Modal
        className={styles.pledgeModal}
        onHide={hideCreateCampaignModal}
        show={createCamapignModalIsOpen}
      >
        <Modal.Header>
          <p className={styles.titlemodal}> {t('createPledge')}</p>
          <Button
            variant="danger"
            onClick={hideCreateCampaignModal}
            data-testid="createPledgeCloseBtn"
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
                  label={t('startDate')}
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
                  label={t('endDate')}
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
                <Form.Label className="">{t('currency')}</Form.Label>
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
                      {t('selectCurrency')}
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
                <Form.Label> {t('amount')} </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Pledge Amount"
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
              data-testid="createPledgeBtn"
            >
              {t('createPledge')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PledgeCreateModal;
