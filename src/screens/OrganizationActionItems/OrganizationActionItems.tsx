import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import styles from './OrganizationActionItems.module.css';
import SortIcon from '@mui/icons-material/Sort';

import { useQuery } from '@apollo/client';
// import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import type { InterfaceActionItemCategoryList } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

function organizationActionItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const currentUrl = window.location.href.split('=')[1];

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const [eventCreateModalIsOpen, setEventCreateModalIsOpen] = useState(false);
  const [eventDetailsModalIsOpen, setEventDetailsModalIsOpen] = useState(false);
  const [eventUpdateModalIsOpen, setEventUpdateModalIsOpen] = useState(false);
  const [eventDeleteModalIsOpen, setEventDeleteModalIsOpen] = useState(false);

  const {
    data,
    loading,
    error,
    refetch,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: currentUrl,
    },
    notifyOnNetworkStatusChange: true,
  });

  // const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);

  // const handleCreate = async (): Promise<void> => {
  //   try {
  //     const { data } = await createActionItem({
  //       variables: {
  //         assigneeId: '65378abd85008f171cf2990d',
  //         actionItemCategoryId: '65b34002f9726a59bcfba8f2',
  //       },
  //     });

  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const createEventHandler = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
  };

  const updateEventHandler = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
  };

  const showCreateModal = (): void => {
    setEventCreateModalIsOpen(!eventCreateModalIsOpen);
  };

  const hideCreateModal = (): void => {
    setEventCreateModalIsOpen(!eventCreateModalIsOpen);
  };

  const showDetailsModal = (): void => {
    setEventDetailsModalIsOpen(!eventDetailsModalIsOpen);
  };

  const hideDetailsModal = (): void => {
    setEventDetailsModalIsOpen(!eventDetailsModalIsOpen);
  };

  const toggleUpdateModel = (): void => {
    setEventUpdateModalIsOpen(!eventUpdateModalIsOpen);
  };

  const toggleDeleteModal = (): void => {
    setEventDeleteModalIsOpen(!eventDeleteModalIsOpen);
  };

  if (loading) {
    return <Loader styles={styles.message} size="lg" />;
  }

  if (error) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          Error occured while loading Action Item Categories Data
          <br />
          {`${error.message}`}
        </h6>
      </div>
    );
  }

  return (
    <>
      <OrganizationScreen screenName="Action Items" title={t('title')}>
        <div className={`${styles.container} bg-white rounded-4 my-3`}>
          <div className={`${styles.btnsContainer} mt-4 mx-4`}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchOrgname"
                className="bg-white"
                placeholder={t('searchByName')}
                data-testid="searchByName"
                autoComplete="off"
                required
                // onKeyUp={handleSearchByEnter}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                // onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <div className={`${styles.dropdownContainer} d-flex flex-wrap`}>
                <Dropdown
                  aria-expanded="false"
                  title="Sort organizations"
                  data-testid="sort"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    // variant={
                    //   sortingState.option === ''
                    //     ? 'outline-success'
                    //     : 'success'
                    // }
                    variant="outline-success"
                    data-testid="sortOrgs"
                  >
                    <SortIcon className={'me-1'} />
                    Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      // onClick={(): void => handleSorting('Latest')}
                      data-testid="latest"
                    >
                      {t('latest')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      // onClick={(): void => handleSorting('Earliest')}
                      data-testid="oldest"
                    >
                      {t('earliest')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  aria-expanded="false"
                  title="Sort organizations"
                  data-testid="sort"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    // variant={
                    //   sortingState.option === ''
                    //     ? 'outline-success'
                    //     : 'success'
                    // }
                    variant="outline-success"
                    data-testid="sortOrgs"
                    className="me-0"
                  >
                    Action Item Category
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {data?.actionItemCategoriesByOrganization.map(
                      (category, index) => (
                        <Dropdown.Item
                          key={index}
                          // onClick={
                          //   /* istanbul ignore next */
                          //   () => setOrgSetting(setting)
                          // }
                          // className={
                          //   orgSetting === setting ? 'text-secondary' : ''
                          // }
                          className="my-1"
                        >
                          {category.name}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Button
                variant="success"
                onClick={showCreateModal}
                data-testid="createActionItemBtn"
              >
                <i className={'fa fa-plus me-2'} />
                {t('createActionItem')}
              </Button>
            </div>
          </div>

          <hr />

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
                  Assigner
                </Col>
                <Col xs={5} sm={3} lg={2} className="fs-5 fw-bold">
                  Options
                </Col>
              </Row>
            </div>

            <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
              {Array.from({ length: 6 }, (_, index) => {
                return (
                  <div key={index}>
                    <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2`}>
                      <Col
                        sm={4}
                        xs={7}
                        md={3}
                        lg={3}
                        className="align-self-center fw-semibold text-body-secondary"
                      >
                        Wilt Shepherd
                      </Col>
                      <Col
                        sm={5}
                        md={6}
                        lg={4}
                        className="d-none d-sm-block align-self-center fw-semibold text-body-secondary"
                      >
                        Action Item Category 1
                      </Col>
                      <Col
                        className="d-none d-lg-block align-self-center fw-semibold text-body-secondary"
                        md={4}
                        lg={3}
                      >
                        Wilt Shepherd
                      </Col>
                      <Col xs={5} sm={3} lg={2} className="p-0">
                        <Button
                          className="btn btn-sm me-2"
                          variant="outline-secondary"
                          onClick={showDetailsModal}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          data-testid="editEventModalBtn"
                          onClick={toggleUpdateModel}
                          className="me-2 d-none d-xl-inline"
                          variant="success"
                        >
                          {' '}
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          size="sm"
                          data-testid="deleteEventModalBtn"
                          variant="danger"
                          onClick={toggleDeleteModal}
                        >
                          {' '}
                          <i className="fa fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>

                    {index !== 5 && <hr className="mx-3" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </OrganizationScreen>

      {/* Create Modal */}
      <Modal show={eventCreateModalIsOpen} onHide={hideCreateModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideCreateModal}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createEventHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Action Item Category</Form.Label>
              <Form.Select>
                {data?.actionItemCategoriesByOrganization.map(
                  (category, index) => (
                    <option key={index}>{category.name}</option>
                  )
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select>
                {data?.actionItemCategoriesByOrganization.map(
                  (category, index) => (
                    <option key={index}>{category.name}</option>
                  )
                )}
              </Form.Select>
            </Form.Group>
            {/* <Form.Control
              type="title"
              id="eventtitle"
              placeholder={t('actionItemCategory')}
              autoComplete="off"
              required
              // value={formState.title}
              // onChange={(e): void => {
              //   setFormState({
              //     ...formState,
              //     title: e.target.value,
              //   });
              // }}
            /> */}
            <label htmlFor="eventdescrip">{t('preCompletionNotes')}</label>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              placeholder={t('preCompletionNotes')}
              autoComplete="off"
              // value={formState.eventdescrip}
              // onChange={(e): void => {
              //   setFormState({
              //     ...formState,
              //     eventdescrip: e.target.value,
              //   });
              // }}
            />
            {/* <label htmlFor="eventLocation">{t('postCompletionNotes')}</label>
            <Form.Control
              type="text"
              id="eventLocation"
              placeholder={t('postCompletionNotes')}
              autoComplete="off"
              required
              // value={formState.location}
              // onChange={(e): void => {
              //   setFormState({
              //     ...formState,
              //     location: e.target.value,
              //   });
              // }}
            /> */}
            <div>
              <DatePicker
                label={t('dueDate')}
                // className={styles.datebox}
                className="mb-3 w-100"
                value={dayjs(startDate)}
                // onChange={(date: Dayjs | null): void => {
                //   if (date) {
                //     setStartDate(date?.toDate());
                //     setEndDate(
                //       endDate &&
                //         (endDate < date?.toDate() ? date?.toDate() : endDate)
                //     );
                //   }
                // }}
              />
            </div>

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="createevent"
              data-testid="createEventBtn"
            >
              {t('createActionItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* preview modal */}
      <Modal show={eventDetailsModalIsOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            onClick={hideDetailsModal}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <p className={styles.preview}>
                {t('eventTitle')}:{' '}
                <span className={styles.view}>
                  {/* {props.eventName ? (
                    <>
                      {props.eventName.length > 100 ? (
                        <>{props.eventName.substring(0, 100)}...</>
                      ) : (
                        <>{props.eventName}</>
                      )}
                    </>
                  ) : (
                    <>Dogs Care</>
                  )} */}
                </span>
              </p>
              <p className={styles.preview}>
                {t('preCompletionNotes')}:
                <span className={styles.view}>test</span>
              </p>
              <p className={styles.preview}>
                {t('postCompletionNotes')}:{' '}
                <span className={styles.view}>test</span>
              </p>
              <p className={styles.preview}>
                {t('dueDate')}: <span className={styles.view}>endDate</span>
              </p>
              <p className={styles.preview}>
                {t('completionDate')}:{' '}
                <span className={styles.view}>endDate</span>
              </p>
            </div>
            <div className={styles.iconContainer}>
              <Button
                size="sm"
                data-testid="editEventModalBtn"
                className={styles.icon}
                onClick={toggleUpdateModel}
              >
                {' '}
                <i className="fas fa-edit"></i>
              </Button>
              <Button
                size="sm"
                data-testid="deleteEventModalBtn"
                className={styles.icon}
                onClick={toggleDeleteModal}
                variant="danger"
              >
                {' '}
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Modal */}
      <Modal
        // id={`editEventModal${props.id}`}
        show={eventUpdateModalIsOpen}
        onHide={toggleUpdateModel}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title
            // id={`editEventModal${props.id}Label`}
            className="text-white"
          >
            {' '}
            {t('editActionItem')}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={updateEventHandler}>
          <Modal.Body className="pb-0">
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Action Item Category</Form.Label>
              <Form.Select className="lh-1">
                {data?.actionItemCategoriesByOrganization.map(
                  (category, index) => (
                    <option key={index}>{category.name}</option>
                  )
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Assignee</Form.Label>
              <Form.Select className="lh-1">
                {data?.actionItemCategoriesByOrganization.map(
                  (category, index) => (
                    <option key={index}>{category.name}</option>
                  )
                )}
              </Form.Select>
            </Form.Group>
            <label htmlFor="eventdescrip">{t('preCompletionNotes')}</label>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              className="mb-3 lh-1"
              autoComplete="off"
              data-testid="updateDescription"
              required
              // value={formState.eventdescrip}
              // onChange={(e): void => {
              //   setFormState({
              //     ...formState,
              //     eventdescrip: e.target.value,
              //   });
              // }}
            />
            <label htmlFor="eventLocation">{t('postCompletionNotes')}</label>
            <Form.Control
              type="text"
              id="eventLocation"
              className="mb-3 lh-1"
              autoComplete="off"
              data-testid="updateLocation"
              required
              // value={formState.location}
              // onChange={(e): void => {
              //   setFormState({
              //     ...formState,
              //     location: e.target.value,
              //   });
              // }}
            />
            <div className={styles.datediv}>
              <div>
                <DatePicker
                  label={t('dueDate')}
                  className={`${styles.datebox} lh-1`}
                  value={dayjs(startDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setStartDate(date?.toDate());
                      setEndDate(
                        endDate &&
                          (endDate < date?.toDate() ? date?.toDate() : endDate)
                      );
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('completionDate')}
                  className={`${styles.datebox} lh-1`}
                  value={dayjs(endDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEndDate(date?.toDate());
                    }
                  }}
                  minDate={dayjs(startDate)}
                />
              </div>
            </div>

            <Form.Group className="my-3 ms-2" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Completed" className="lh-1" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              data-testid="EventUpdateModalCloseBtn"
              onClick={toggleUpdateModel}
            >
              {t('close')}
            </Button>
            <Button
              type="submit"
              className="btn btn-success"
              data-testid="updatePostBtn"
            >
              {t('update')}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        size="sm"
        // id={`deleteEventModal${props.id}`}
        show={eventDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title
            className="text-white"
            // id={`deleteEventModalLabel${props.id}`}
          >
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
            data-testid="EventDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            // onClick={deleteEvent}
            data-testid="deleteEventBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default organizationActionItems;
