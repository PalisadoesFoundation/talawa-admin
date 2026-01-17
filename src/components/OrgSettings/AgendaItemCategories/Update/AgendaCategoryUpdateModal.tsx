/**
 * AgendaCategoryUpdateModal Component
 *
 * This component renders a modal for updating an agenda category.
 * It provides a form with fields for the category name and description,
 * and allows users to submit updates. The modal can be toggled open or closed.
 *
 * @component
 * @param {InterfaceAgendaCategoryUpdateModalProps} props - The props for the component.
 * @param {boolean} props.agendaCategoryUpdateModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.hideUpdateModal - Function to close the modal.
 * @param {InterfaceFormStateType} props.formState - The current state of the form fields.
 * @param {(state: React.SetStateAction<InterfaceFormStateType>) => void} props.setFormState - Function to update the form state.
 * @param {(e: ChangeEvent<HTMLFormElement>) => Promise<void>} props.updateAgendaCategoryHandler - Handler for form submission.
 * @param {(key: string) => string} props.t - Translation function for localization.
 *
 * @interface InterfaceFormStateType
 * @property {string} name - The name of the agenda category.
 * @property {string} description - The description of the agenda category.
 * @property {string} createdBy - The creator of the agenda category.
 *
 * @interface InterfaceAgendaCategoryUpdateModalProps
 * @property {boolean} agendaCategoryUpdateModalIsOpen - Modal visibility state.
 * @property {() => void} hideUpdateModal - Function to hide the modal.
 * @property {InterfaceFormStateType} formState - Form state object.
 * @property {(state: React.SetStateAction<InterfaceFormStateType>) => void} setFormState - State updater for the form.
 * @property {(e: ChangeEvent<HTMLFormElement>) => Promise<void>} updateAgendaCategoryHandler - Form submission handler.
 * @property {(key: string) => string} t - Translation function.
 *
 * @returns {JSX.Element} The rendered modal component.
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';
import type { ChangeEvent } from 'react';

import styles from 'style/app-fixed.module.css';

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
            className={styles.regBtn}
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
