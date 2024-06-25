import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';

import styles from './AgendaItemsContainer.module.css';

interface InterfaceFormStateType {
  agendaItemCategoryIds: { _id: string; name: string }[];
  title: string;
  description: string;
  sequence: number;
  duration: string;
  attachments: string[];
  urls: string[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface InterfaceAgendaItemsUpdateModalProps {
  agendaItemUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
}

const AgendaItemsUpdateModal: React.FC<
  InterfaceAgendaItemsUpdateModalProps
> = ({
  agendaItemUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateAgendaItemHandler,
  t,
}) => {
  return (
    <Modal
      className={styles.AgendaItemModal}
      show={agendaItemUpdateModalIsOpen}
      onHide={hideUpdateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodal}>{t('updateAgendaItem')}</p>
        <Button
          onClick={hideUpdateModal}
          data-testid="updateAgendaItemModalCloseBtn"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateAgendaItemHandler}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>{t('title')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('title')}
              value={formState.title}
              onChange={(e) =>
                setFormState({ ...formState, title: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              as="textarea"
              placeholder={t('description')}
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="sequence">
            <Form.Label>{t('sequence')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('sequence')}
              value={formState.sequence}
              onChange={(e) =>
                setFormState({ ...formState, sequence: Number(e.target.value) })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="duration">
            <Form.Label>{t('duration')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('duration')}
              value={formState.duration}
              onChange={(e) =>
                setFormState({ ...formState, duration: e.target.value })
              }
            />
          </Form.Group>
          {/* <Form.Group className="mb-3" controlId="attachments">
            <Form.Label>{t('attachments')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('attachments')}
              value={formState.attachments}
              onChange={(e) =>
                setFormState({ ...formState, attachments: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="urls">
            <Form.Label>{t('urls')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('urls')}
              value={formState.urls}
              onChange={(e) =>
                setFormState({ ...formState, urls: e.target.value })
              }
            />
          </Form.Group> */}
          <Button
            type="submit"
            className={styles.greenregbtn}
            data-testid="editAgendaItemBtn"
          >
            {t('update')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaItemsUpdateModal;
