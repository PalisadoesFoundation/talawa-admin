import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import type { ChangeEvent } from 'react';
import styles from './OrgList.module.css';

interface InterfaceFormStateType {
  name: string;
  descrip: string;
  userRegistrationRequired: boolean;
  visible: boolean;
  location: string;
  image: string;
}
interface InterfaceUserType {
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
    userType: string;
    adminFor: {
      _id: string;
      name: string;
      image: string | null;
    }[];
  };
  // Add more properties if needed
}

interface InterfaceOrganizationModalProps {
  showModal: boolean;
  toggleModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createOrg: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  userData: InterfaceUserType | undefined;
  triggerCreateSampleOrg: () => void;
}

const OrganizationModal: React.FC<InterfaceOrganizationModalProps> = ({
  showModal,
  toggleModal,
  formState,
  setFormState,
  createOrg,
  t,
  userData,
  triggerCreateSampleOrg,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={toggleModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        className="bg-primary"
        closeButton
        data-testid="modalOrganizationHeader"
      >
        <Modal.Title className="text-white">
          {t('createOrganization')}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmitCapture={createOrg}>
        <Modal.Body>
          <Form.Label htmlFor="orgname">{t('name')}</Form.Label>
          <Form.Control
            type="name"
            id="orgname"
            className="mb-3"
            placeholder={t('enterName')}
            data-testid="modalOrganizationName"
            autoComplete="off"
            required
            value={formState.name}
            onChange={(e): void => {
              const inputText = e.target.value;
              if (inputText.length < 50) {
                setFormState({
                  ...formState,
                  name: e.target.value,
                });
              }
            }}
          />
          <Form.Label htmlFor="descrip">{t('description')}</Form.Label>
          <Form.Control
            type="descrip"
            id="descrip"
            className="mb-3"
            placeholder={t('description')}
            autoComplete="off"
            required
            value={formState.descrip}
            onChange={(e): void => {
              const descriptionText = e.target.value;
              if (descriptionText.length < 200) {
                setFormState({
                  ...formState,
                  descrip: e.target.value,
                });
              }
            }}
          />
          <Form.Label htmlFor="location">{t('location')}</Form.Label>
          <Form.Control
            type="text"
            id="location"
            className="mb-3"
            placeholder={t('location')}
            autoComplete="off"
            required
            value={formState.location}
            onChange={(e): void => {
              const locationText = e.target.value;
              if (locationText.length < 100) {
                setFormState({
                  ...formState,
                  location: e.target.value,
                });
              }
            }}
          />

          <Row className="mb-3">
            <Col>
              <Form.Label htmlFor="userRegistrationRequired">
                {t('userRegistrationRequired')}
              </Form.Label>
              <Form.Switch
                id="userRegistrationRequired"
                data-testid="userRegistrationRequired"
                type="checkbox"
                defaultChecked={formState.userRegistrationRequired}
                onChange={(): void =>
                  setFormState({
                    ...formState,
                    userRegistrationRequired:
                      !formState.userRegistrationRequired,
                  })
                }
              />
            </Col>
            <Col>
              <Form.Label htmlFor="visibleInSearch">
                {t('visibleInSearch')}
              </Form.Label>
              <Form.Switch
                id="visibleInSearch"
                data-testid="visibleInSearch"
                type="checkbox"
                defaultChecked={formState.visible}
                onChange={(): void =>
                  setFormState({
                    ...formState,
                    visible: !formState.visible,
                  })
                }
              />
            </Col>
          </Row>
          <Form.Label htmlFor="orgphoto">{t('displayImage')}</Form.Label>
          <Form.Control
            accept="image/*"
            id="orgphoto"
            className="mb-3"
            name="photo"
            type="file"
            multiple={false}
            onChange={async (e: React.ChangeEvent): Promise<void> => {
              const target = e.target as HTMLInputElement;
              const file = target.files && target.files[0];
              /* istanbul ignore else */
              if (file)
                setFormState({
                  ...formState,
                  image: await convertToBase64(file),
                });
            }}
            data-testid="organisationImage"
          />
          <Col className={styles.sampleOrgSection}>
            <Button
              className={styles.orgCreationBtn}
              type="submit"
              value="invite"
              data-testid="submitOrganizationForm"
            >
              {t('createOrganization')}
            </Button>

            <div className="position-relative">
              <hr />
              <span className={styles.orText}>{t('OR')}</span>
            </div>
            {userData &&
              ((userData.user.userType === 'ADMIN' &&
                userData.user.adminFor.length > 0) ||
                userData.user.userType === 'SUPERADMIN') && (
                <div className={styles.sampleOrgSection}>
                  <Button
                    className={styles.sampleOrgCreationBtn}
                    onClick={() => triggerCreateSampleOrg()}
                    data-testid="createSampleOrganizationBtn"
                  >
                    {t('createSampleOrganization')}
                  </Button>
                </div>
              )}
          </Col>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

export default OrganizationModal;
