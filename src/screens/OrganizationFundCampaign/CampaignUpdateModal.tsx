/*eslint-disable */
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { currencyOptions } from 'utils/currency';
import { InterfaceCreateCampaign } from 'utils/interfaces';
import styles from './OrganizationFundCampaign.module.css';

interface InterfaceCampaignUpdateModal {
  campaignUpdateModalIsOpen: boolean;
  hideUpdateCampaignModal: () => void;
  formState: InterfaceCreateCampaign;
  setFormState: (state: React.SetStateAction<InterfaceCreateCampaign>) => void;
  updateCampaignHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
}

const CampaignUpdateModal: React.FC<InterfaceCampaignUpdateModal> = ({
  campaignUpdateModalIsOpen,
  hideUpdateCampaignModal,
  formState,
  setFormState,
  updateCampaignHandler,
}) => {
  return (
    <>
      <Modal show={campaignUpdateModalIsOpen} onHide={hideUpdateCampaignModal}>
        <Modal.Header>
          <p className={styles.titlemodal}> Update Fund Campaign</p>
          <Button variant="danger" onClick={hideUpdateCampaignModal}>
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateCampaignHandler}>
            <Form.Group className="mb-3">
              <Form.Label> Campaign Name </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Campaign Name"
                value={formState.campaignName}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    campaignName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="d-flex justify-content-between mb-3">
              <div>
                <DatePicker
                  label="Start Date"
                  value={dayjs(formState.campaignStartDate)}
                  className="me-4 "
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setFormState({
                        ...formState,
                        campaignStartDate: date.toDate(),
                        campaignEndDate:
                          formState.campaignEndDate &&
                          (formState.campaignEndDate < date?.toDate()
                            ? date.toDate()
                            : formState.campaignEndDate),
                      });
                    }
                  }}
                  minDate={dayjs(new Date())}
                />
              </div>
              <div>
                <DatePicker
                  label="End Date"
                  value={dayjs(formState.campaignEndDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setFormState({
                        ...formState,
                        campaignEndDate: date.toDate(),
                      });
                    }
                  }}
                  minDate={dayjs(formState.campaignStartDate)}
                />
              </div>
            </Form.Group>
            <Form.Group className="d-flex ">
              <Form.Group className="  ">
                <Form.Label>Currency</Form.Label>
                <Col md={6}>
                  <Form.Control
                    as="select"
                    value={formState.campaignCurrency}
                    size="sm"
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        campaignCurrency: e.target.value,
                      });
                    }}
                  >
                    <option value="" disabled>
                      Select a currency
                    </option>
                    {currencyOptions.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group className="me-10 pe-5">
                <Form.Label> Funding Goal </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Funding Goal"
                  value={formState.campaignGoal}
                  className="p-1"
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 0) {
                      setFormState({
                        ...formState,
                        campaignGoal: parseInt(e.target.value),
                      });
                    }
                  }}
                />
              </Form.Group>
            </Form.Group>
            <Button type="submit" className={styles.greenregbtn}>
              Update Fund Campagin
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CampaignUpdateModal;
