/**
 * Renders a modal for creating a new agenda category.
 *
 * @remarks
 * This modal provides a form to enter the agenda category name and description.
 * It manages form state externally via props and triggers a submit handler
 * when the form is submitted.
 *
 * @param props - Props for {@link InterfaceAgendaCategoryCreateModalProps}.
 *
 * @returns A JSX element rendering the agenda category creation modal.
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
