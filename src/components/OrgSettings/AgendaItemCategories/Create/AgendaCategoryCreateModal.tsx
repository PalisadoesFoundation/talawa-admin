import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from 'style/app.module.css';
/**
 * InterfaceFormStateType is an object containing the form state
 */
interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}

/**
 * InterfaceAgendaCategoryCreateModalProps is an object containing the props for AgendaCategoryCreateModal component
 */
interface InterfaceAgendaCategoryCreateModalProps {
  agendaCategoryCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createAgendaCategoryHandler: (
    e: ChangeEvent<HTMLFormElement>,
  ) => Promise<void>;
  t: (key: string) => string;
}

/**
 * AgendaCategoryCreateModal component is used to create the agenda category details like name, description
 * @param  agendaCategoryCreateModalIsOpen - boolean value to check if the modal is open or not
 * @param  hideCreateModal - function to hide the modal
 * @param  formState - object containing the form state
 * @param  setFormState - function to set the form state
 * @param  createAgendaCategoryHandler - function to create the agenda category
 * @param  t - i18n function to translate the text
 * @returns  returns the AgendaCategoryCreateModal component
 */
const AgendaCategoryCreateModal: React.FC<
  InterfaceAgendaCategoryCreateModalProps
> = ({
  agendaCategoryCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createAgendaCategoryHandler,
  t,
}) => {
  return (
    <Modal
      className={`mt-5 ${styles.campaignModal}`}
      show={agendaCategoryCreateModalIsOpen}
      onHide={hideCreateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalOrganizationEvents}>
          {t('agendaCategoryDetails')}
        </p>
        <Button
          variant="danger"
          onClick={hideCreateModal}
          data-testid="createAgendaCategoryModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createAgendaCategoryHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('name')}
              value={formState.name}
              required
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('description')}
              required
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>
          <Button
            type="submit"
            className={styles.greenregbtn}
            value="createAgendaCategory"
            data-testid="createAgendaCategoryFormSubmitBtn"
          >
            {t('createAgendaCategory')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaCategoryCreateModal;
