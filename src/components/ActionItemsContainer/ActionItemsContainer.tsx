import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import type { Dayjs } from 'dayjs';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type {
  InterfaceActionItemInfo,
  InterfaceActionItemList,
} from 'utils/interfaces';
import styles from './ActionItemsContainer.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import {
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

function actionItemsContainer({
  actionItemsData,
  membersData,
  refetch,
}: {
  actionItemsData: InterfaceActionItemList | undefined;
  membersData: any;
  refetch: any;
}): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [actionItemUpdateModalIsOpen, setActionItemUpdateModalIsOpen] =
    useState(false);
  const [actionItemDeleteModalIsOpen, setActionItemDeleteModalIsOpen] =
    useState(false);

  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [completionDate, setCompletionDate] = useState<Date | null>();
  const [actionItemId, setActionItemId] = useState('');

  const [formState, setFormState] = useState({
    assignee: '',
    assigneeId: '',
    preCompletionNotes: '',
    postCompletionNotes: '',
    isCompleted: false,
  });

  const showUpdateModal = (): void => {
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };

  const hideUpdateModal = (): void => {
    setActionItemId('');
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };

  const toggleDeleteModal = (): void => {
    setActionItemDeleteModalIsOpen(!actionItemDeleteModalIsOpen);
  };

  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  const updateActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await updateActionItem({
        variables: {
          actionItemId,
          assigneeId: formState.assigneeId,
          preCompletionNotes: formState.preCompletionNotes,
          postCompletionNotes: formState.postCompletionNotes,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
          completionDate: dayjs(completionDate).format('YYYY-MM-DD'),
          isCompleted: formState.isCompleted,
        },
      });

      refetch();
      hideUpdateModal();
      toast.success(t('successfulUpdation'));
    } catch (error: any) {
      toast.success(error.message);
      console.log(error);
    }
  };

  const [removeActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION);
  const deleteActionItemHandler = async (): Promise<void> => {
    try {
      await removeActionItem({
        variables: {
          actionItemId,
        },
      });

      refetch();
      toggleDeleteModal();
      toast.success(t('successfulDeletion'));
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEditClick = (actionItem: InterfaceActionItemInfo): void => {
    setFormState({
      ...formState,
      assignee: `${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`,
      assigneeId: actionItem.assignee._id,
      preCompletionNotes: actionItem.preCompletionNotes,
      postCompletionNotes: actionItem.postCompletionNotes,
      isCompleted: actionItem.isCompleted,
    });
    setActionItemId(actionItem._id);
    setDueDate(actionItem.dueDate);
    setCompletionDate(actionItem.completionDate);
    showUpdateModal();
  };

  return (
    <>
      <div className="mx-1 my-4">
        <div className="mx-4 shadow-sm rounded-top-4">
          <Row className="mx-0 border border-light-subtle rounded-top-4 py-3">
            <Col xs={7} sm={4} md={3} lg={3} className="ps-3 fs-5 fw-bold">
              Assignee
            </Col>
            <Col
              className="fs-5 fw-bold d-none d-sm-block"
              sm={5}
              md={6}
              lg={4}
            >
              Action Item Category
            </Col>
            <Col className="d-none d-lg-block fs-5 fw-bold" md={4} lg={3}>
              Status
            </Col>
            <Col xs={5} sm={3} lg={2} className="fs-5 fw-bold">
              Options
            </Col>
          </Row>
        </div>

        <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
          {actionItemsData?.actionItemsByOrganization.map(
            (actionItem, index) => (
              <div key={index}>
                <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2`}>
                  <Col
                    sm={4}
                    xs={7}
                    md={3}
                    lg={3}
                    className="align-self-center fw-semibold text-body-secondary"
                  >
                    {`${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`}
                  </Col>
                  <Col
                    sm={5}
                    md={6}
                    lg={4}
                    className="d-none d-sm-block align-self-center fw-semibold text-body-secondary"
                  >
                    {actionItem.actionItemCategory.name}
                  </Col>
                  <Col
                    className="d-none d-lg-block align-self-center fw-semibold text-body-secondary"
                    md={4}
                    lg={3}
                  >
                    {actionItem.isCompleted ? 'Completed' : 'In Progress'}
                  </Col>
                  <Col xs={5} sm={3} lg={2} className="p-0">
                    <Button
                      className="btn btn-sm me-2"
                      variant="outline-secondary"
                      // onClick={showDetailsModal}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      data-testid="editActionItemModalBtn"
                      onClick={() => handleEditClick(actionItem)}
                      className="me-2 d-none d-xl-inline"
                      variant="success"
                    >
                      {' '}
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      size="sm"
                      data-testid="deleteActionItemModalBtn"
                      variant="danger"
                      onClick={() => {
                        setActionItemId(actionItem._id);
                        toggleDeleteModal();
                      }}
                    >
                      {' '}
                      <i className="fa fa-trash"></i>
                    </Button>
                  </Col>
                </Row>

                {index !==
                  actionItemsData.actionItemsByOrganization.length - 1 && (
                  <hr className="mx-3" />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Update Modal */}
      <Modal show={actionItemUpdateModalIsOpen} onHide={hideUpdateModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideUpdateModal}
            data-testid="updateActionItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateActionItemHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {formState.assignee}
                </option>
                {membersData?.map((member: any, index: any) => {
                  const currMemberName = `${member.firstName} ${member.lastName}`;
                  if (currMemberName !== formState.assignee) {
                    return (
                      <option key={index} value={member._id}>
                        {`${member.firstName} ${member.lastName}`}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>

            <label htmlFor="actionItemPreCompletionNotes">
              {t('preCompletionNotes')}
            </label>
            <Form.Control
              type="actionItemPreCompletionNotes"
              id="actionItemPreCompletionNotes"
              placeholder={t('preCompletionNotes')}
              autoComplete="off"
              value={formState.preCompletionNotes || ''}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
            />

            <label htmlFor="actionItemPostCompletionNotes">
              {t('postCompletionNotes')}
            </label>
            <Form.Control
              type="actionItemPostCompletionNotes"
              id="actionItemPostCompletionNotes"
              placeholder={t('postCompletionNotes')}
              autoComplete="off"
              value={formState.postCompletionNotes || ''}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  postCompletionNotes: e.target.value,
                });
              }}
            />

            <div className={styles.datediv}>
              <div>
                <DatePicker
                  label={t('dueDate')}
                  className={styles.datebox}
                  value={dayjs(dueDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setDueDate(date?.toDate());
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('completionDate')}
                  className={`${styles.datebox} ms-auto`}
                  value={dayjs(completionDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setCompletionDate(date?.toDate());
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="allday">{t('isCompleted')}?</label>
                <Form.Switch
                  className="ms-2"
                  id="allday"
                  type="checkbox"
                  checked={formState.isCompleted}
                  data-testid="alldayCheck"
                  onChange={(): void =>
                    setFormState({
                      ...formState,
                      isCompleted: !formState.isCompleted,
                    })
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="editActionItem"
              data-testid="editActionItemBtn"
            >
              {t('editActionItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal
        size="sm"
        id={`deleteActionItemModal`}
        show={actionItemDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`deleteActionItem`}>
            {t('deleteActionItem')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('deleteActionItemMsg')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="actionItemDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteActionItemHandler}
            data-testid="deleteActionItemBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default actionItemsContainer;
