/**
 * AgendaCategoryCreateModal Component
 *
 * This component renders a modal for creating a new agenda category.
 * It provides a form with fields for the category name and description,
 * and allows users to submit the new category.
 *
 * @param props - The props for the component.
 * @param agendaCategoryCreateModalIsOpen - Determines if the modal is open or closed.
 * @param hideCreateModal - Function to hide/close the modal.
 * @param formState - Current state of the form containing name, description, and createdBy.
 * @param setFormState - Function to update the form state.
 * @param createAgendaCategoryHandler - Async function to handle the agenda category creation.
 * @param t - Translation function for internationalized strings.
 *
 * @returns A React functional component that renders the create modal.
 */
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';
// translation-check-keyPrefix: organizationAgendaCategory

interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}
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
    <BaseModal
      show={agendaCategoryCreateModalIsOpen}
      onHide={hideCreateModal}
      className={`mt-5 ${styles.campaignModal}`}
      headerContent={
        <p className={styles.titlemodalOrganizationEvents}>
          {t('agendaCategoryDetails')}
        </p>
      }
      dataTestId="agendaCategoryCreateModal"
    >
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
          className={styles.regBtn}
          value="createAgendaCategory"
          data-testid="createAgendaCategoryFormSubmitBtn"
        >
          {t('createAgendaCategory')}
        </Button>
      </Form>
    </BaseModal>
  );
};

export default AgendaCategoryCreateModal;
