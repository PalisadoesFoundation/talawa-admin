/**
 * AgendaCategoryUpdateModal Component
 *
 * This component renders a modal for updating an agenda category.
 * It provides a form with fields for the category name and description,
 * and allows users to submit updates. The modal can be toggled open or closed.
 *
 * @param props - Props for {@link InterfaceAgendaCategoryUpdateModalProps}
 *
 * @returns The rendered modal component.
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
    <BaseModal
      className={styles.campaignModal}
      show={agendaCategoryUpdateModalIsOpen}
      onHide={hideUpdateModal}
      headerContent={
        <p className={styles.titlemodalOrganizationEvents}>
          {t('updateAgendaCategory')}
        </p>
      }
      dataTestId="agendaCategoryUpdateModal"
    >
      <Form onSubmit={updateAgendaCategoryHandler}>
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
            value={formState.description}
            required
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
    </BaseModal>
  );
};

export default AgendaCategoryUpdateModal;
