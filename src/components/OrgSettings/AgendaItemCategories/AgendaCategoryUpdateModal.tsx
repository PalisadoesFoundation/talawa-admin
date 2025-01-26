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
 * InterfaceAgendaCategoryUpdateModalProps is an object containing the props for AgendaCategoryUpdateModal component
 */
interface InterfaceAgendaCategoryUpdateModalProps {
  agendaCategoryUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateAgendaCategoryHandler: (
    e: ChangeEvent<HTMLFormElement>,
  ) => Promise<void>;
  t: (key: string) => string;
}

/**
 * AgendaCategoryUpdateModal component is used to update the agenda category details like name, description
 * @param  agendaCategoryUpdateModalIsOpen - boolean value to check if the modal is open or not
 * @param  hideUpdateModal - function to hide the modal
 * @param  formState - object containing the form state
 * @param  setFormState - function to set the form state
 * @param  updateAgendaCategoryHandler - function to update the agenda category
 * @param  t - i18n function to translate the text
 * @returns  returns the AgendaCategoryUpdateModal component
 */
const AgendaCategoryUpdateModal: React.FC<
  InterfaceAgendaCategoryUpdateModalProps
> = ({
  agendaCategoryUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateAgendaCategoryHandler,
  t,
}) => {
  return (
    <Modal
      className={styles.campaignModal}
      show={agendaCategoryUpdateModalIsOpen}
      onHide={hideUpdateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalOrganizationEvents}>
          {t('updateAgendaCategory')}
        </p>
        <Button
          onClick={hideUpdateModal}
          data-testid="updateAgendaCategoryModalCloseBtn"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateAgendaCategoryHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('name')}
              value={formState.name}
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
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>
          <Button
            type="submit"
            className={styles.greenregbtn}
            data-testid="editAgendaCategoryBtn"
          >
            {t('update')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaCategoryUpdateModal;
