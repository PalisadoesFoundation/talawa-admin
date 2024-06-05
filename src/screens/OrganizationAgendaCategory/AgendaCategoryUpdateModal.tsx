import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';

import styles from './OrganizationAgendaCategory.module.css';

interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}

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
      className={styles.AgendaCategoryModal}
      show={agendaCategoryUpdateModalIsOpen}
      onHide={hideUpdateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodal}>{t('updateAgendaCategory')}</p>
        <Button
          onClick={hideUpdateModal}
          data-testid="updateAgendaCategoryModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateAgendaCategoryHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
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
              placeholder="Enter Description"
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {t('update')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaCategoryUpdateModal;
