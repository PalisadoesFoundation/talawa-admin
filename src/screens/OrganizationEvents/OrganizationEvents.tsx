import React, { ChangeEvent, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Form } from 'antd';
import { useMutation, useQuery } from '@apollo/client';

import styles from './OrganizationEvents.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import EventListCard from 'components/EventListCard/EventListCard';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { RootState } from 'state/reducers';
import PaginationList from 'components/PaginationList/PaginationList';
import { toast } from 'react-toastify';

function OrganizationEvents(): JSX.Element {
  document.title = 'Talawa Events';
  const [eventmodalisOpen, setEventModalIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchState, setSearchState] = useState({
    byTitle: '',
    byDescription: '',
  });

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const [alldaychecked, setAllDayChecked] = React.useState(true);
  const [recurringchecked, setRecurringChecked] = React.useState(false);

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);

  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    date: '',
    location: '',
    startTime: '',
    endTime: '',
  });
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const showInviteModal = () => {
    setEventModalIsOpen(true);
  };
  const hideInviteModal = () => {
    setEventModalIsOpen(false);
  };

  const { data, loading, error, refetch } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: currentUrl },
  });

  const [create, { loading: loading_2 }] = useMutation(CREATE_EVENT_MUTATION);

  const CreateEvent = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await create({
        variables: {
          title: formState.title,
          description: formState.eventdescrip,
          isPublic: publicchecked,
          recurring: recurringchecked,
          isRegisterable: registrablechecked,
          organizationId: currentUrl,
          startDate: startDate?.toDateString(),
          endDate: endDate?.toDateString(),
          allDay: alldaychecked,
          location: formState.location,
          startTime: formState.startTime,
          endTime: formState.endTime,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('Congratulations! The Event is created.');
        refetch();
        setFormState({
          title: '',
          eventdescrip: '',
          date: '',
          location: '',
          startTime: '',
          endTime: '',
        });
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  if (loading || loading_2) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign('/orglist');
  }

  /* istanbul ignore next */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchByTitle = (e: any) => {
    const { value } = e.target;
    setSearchState({ ...searchState, byTitle: value });
    const filterData = {
      id: currentUrl,
      filterByTitle: searchState.byTitle,
    };
    refetch(filterData);
  };
  const handleSearchByDescription = (e: any) => {
    const { value } = e.target;
    setSearchState({ ...searchState, byDescription: value });
    const filterData = {
      id: currentUrl,
      filterByDescription: searchState.byDescription,
    };
    refetch(filterData);
  };

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Filter by Title</h6>
              <input
                type="name"
                id="searchTitle"
                placeholder="Enter filter"
                autoComplete="off"
                required
                onChange={handleSearchByTitle}
                data-testid="serachByTitle"
              />

              <h6 className={styles.searchtitle}>Filter by Description</h6>
              <input
                type="name"
                id="searchDescription"
                placeholder="Enter filter"
                autoComplete="off"
                required
                onChange={handleSearchByDescription}
                data-testid="serachByDescription"
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Events</p>
              <Button
                variant="success"
                className={styles.addbtn}
                onClick={showInviteModal}
                data-testid="createEventModalBtn"
              >
                <i className="fa fa-plus"></i> Add Event
              </Button>
            </Row>
            <div className={`row ${styles.list_box}`}>
              {data
                ? (rowsPerPage > 0
                    ? data.eventsByOrganization.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : data.eventsByOrganization
                  ).map(
                    (datas: {
                      _id: string;
                      title: string;
                      description: string;
                      startDate: string;
                      endDate: string;
                      location: string;
                      startTime: string;
                      endTime: string;
                      allDay: boolean;
                      recurring: boolean;
                      isPublic: boolean;
                      isRegisterable: boolean;
                    }) => {
                      return (
                        <EventListCard
                          key={datas._id}
                          id={datas._id}
                          eventLocation={datas.location}
                          eventName={datas.title}
                          eventDescription={datas.description}
                          regDate={datas.startDate}
                          regEndDate={datas.endDate}
                          startTime={datas.startTime}
                          endTime={datas.endTime}
                          allDay={datas.allDay}
                          recurring={datas.recurring}
                          isPublic={datas.isPublic}
                          isRegisterable={datas.isRegisterable}
                        />
                      );
                    }
                  )
                : null}
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <PaginationList
                    count={data ? data.eventsByOrganization.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={eventmodalisOpen}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
        ariaHideApp={false}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.titlemodal}>Event Details</p>
              <a
                onClick={hideInviteModal}
                className={styles.cancel}
                data-testid="createEventModalCloseBtn"
              >
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form onSubmitCapture={CreateEvent}>
              <label htmlFor="eventtitle">Title</label>
              <input
                type="title"
                id="eventitle"
                placeholder="Enter Title"
                autoComplete="off"
                required
                value={formState.title}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    title: e.target.value,
                  });
                }}
              />
              <label htmlFor="eventdescrip">Description</label>
              <input
                type="eventdescrip"
                id="eventdescrip"
                placeholder="Enter Description"
                autoComplete="off"
                required
                value={formState.eventdescrip}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    eventdescrip: e.target.value,
                  });
                }}
              />
              <label htmlFor="eventLocation">Location</label>
              <input
                type="text"
                id="eventLocation"
                placeholder="Enter Location"
                autoComplete="off"
                required
                value={formState.location}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    location: e.target.value,
                  });
                }}
              />
              <div className={styles.datediv}>
                <div>
                  <label htmlFor="startdate">Start Date</label>
                  <DatePicker
                    className={styles.datebox}
                    id="startdate"
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    placeholderText="Start Date"
                  />
                </div>
                <div>
                  <label htmlFor="enddate">End Date</label>
                  <DatePicker
                    className={styles.datebox}
                    id="enddate"
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    placeholderText="End Date"
                  />
                </div>
              </div>
              {!alldaychecked && (
                <div className={styles.datediv}>
                  <div className="mr-3">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      id="startTime"
                      placeholder="Start Time"
                      value={formState.startTime}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime">End Time</label>
                    <input
                      id="endTime"
                      placeholder="End Time"
                      value={formState.endTime}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="allday">All Day?</label>
                  <input
                    id="allday"
                    type="checkbox"
                    defaultChecked={alldaychecked}
                    data-testid="alldayCheck"
                    onChange={() => setAllDayChecked(!alldaychecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="recurring">Recurring Event:</label>
                  <input
                    id="recurring"
                    type="checkbox"
                    data-testid="recurringCheck"
                    defaultChecked={recurringchecked}
                    onChange={() => setRecurringChecked(!recurringchecked)}
                  />
                </div>
              </div>
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="ispublic">Is Public?</label>
                  <input
                    id="ispublic"
                    type="checkbox"
                    data-testid="ispublicCheck"
                    defaultChecked={publicchecked}
                    onChange={() => setPublicChecked(!publicchecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="registrable">Is Registrable?</label>
                  <input
                    id="registrable"
                    type="checkbox"
                    data-testid="registrableCheck"
                    defaultChecked={registrablechecked}
                    onChange={() => setRegistrableChecked(!registrablechecked)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.greenregbtn}
                value="createevent"
                data-testid="createEventBtn"
              >
                Create Event
              </button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}

export default OrganizationEvents;
