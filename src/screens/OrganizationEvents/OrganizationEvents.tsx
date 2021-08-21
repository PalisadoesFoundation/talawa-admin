import React, { useState } from 'react';
import styles from './OrganizationEvents.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import { Form } from 'antd';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import EventListCard from 'components/EventListCard/EventListCard';
import { useMutation, useQuery } from '@apollo/client';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';

function OrganizationEvents(): JSX.Element {
  const [eventmodalisOpen, setEventModalIsOpen] = React.useState(false);

  const showInviteModal = () => {
    setEventModalIsOpen(true);
  };
  const hideInviteModal = () => {
    setEventModalIsOpen(false);
  };

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const [alldaychecked, setAllDayChecked] = React.useState(true);
  const [recurringchecked, setRecurringChecked] = React.useState(false);

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);

  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    ispublic: false,
    date: '',
  });
  const currentUrl = window.location.href.split('=')[1];

  const { data, loading } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: currentUrl },
  });

  const [create, { loading: loading_2, error }] = useMutation(
    CREATE_EVENT_MUTATION
  );

  const CreateEvent = async () => {
    try {
      const { data } = await create({
        variables: {
          title: formState.title,
          description: formState.eventdescrip,
          isPublic: formState.ispublic,
          recurring: recurringchecked,
          isRegisterable: registrablechecked,
          organizationId: currentUrl,
          startDate: startDate?.toDateString(),
          endDate: endDate?.toDateString(),
          allDay: alldaychecked,
        },
      });
      console.log(data);
      window.alert('Congratulation the Event is created');
      window.location.reload();
    } catch (error) {
      window.alert(error);
    }
  };

  if (loading || loading_2) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  console.log(data);
  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgpeople/id=' + currentUrl;
  const url_3 = '/orgevents/id=' + currentUrl;
  const url_4 = '/orgcontribution/id=' + currentUrl;
  const url_5 = '/orgpost/id=' + currentUrl;
  const url_6 = '/orgsettings/id=' + currentUrl;

  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: url },
          { name: 'People', url: url_2 },
          { name: 'Events', url: url_3 },
          { name: 'Contributions', url: url_4 },
          { name: 'Posts', url: url_5 },
        ]}
        url_1={url_6}
      />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Filter by Organization</h6>
              <input
                type="name"
                id="orgname"
                placeholder="Enter Name"
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>Filter by Location</h6>
              <input
                type="name"
                id="searchlocation"
                placeholder="Enter Location"
                autoComplete="off"
                required
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Events</p>
              <button className={styles.addbtn} onClick={showInviteModal}>
                + Add Event
              </button>
            </Row>
            {data
              ? data.eventsByOrganization.map(
                  (datas: {
                    _id: string;
                    title: string;
                    description: string;
                    startDate: string;
                  }) => {
                    return (
                      <EventListCard
                        key={datas._id}
                        id={datas._id}
                        eventLocation="India"
                        eventName={datas.title}
                        totalAdmin="10"
                        totalMember="30"
                        eventImage=""
                        regDate={datas.startDate}
                        regDays="2 days"
                      />
                    );
                  }
                )
              : null}
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={eventmodalisOpen}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.titlemodal}>Create Event</p>
              <a onClick={hideInviteModal} className={styles.cancel}>
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form>
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
              <div className={styles.datediv}>
                <div>
                  <label htmlFor="startdate">Start Date</label>
                  <DatePicker
                    className={styles.datebox}
                    id="startdate"
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                  />
                </div>
                <div>
                  <label htmlFor="enddate">End Date</label>
                  <DatePicker
                    className={styles.datebox}
                    id="enddate"
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                  />
                </div>
              </div>
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="allday">All Day?</label>
                  <input
                    id="allday"
                    type="checkbox"
                    defaultChecked={alldaychecked}
                    onChange={() => setAllDayChecked(!alldaychecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="recurring">Recurring Event:</label>
                  <input
                    id="recurring"
                    type="checkbox"
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
                    defaultChecked={publicchecked}
                    onChange={() => setPublicChecked(!publicchecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="visible">Is Registrable?</label>
                  <input
                    id="registrable"
                    type="checkbox"
                    defaultChecked={registrablechecked}
                    onChange={() => setRegistrableChecked(!registrablechecked)}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.greenregbtn}
                value="createevent"
                onClick={CreateEvent}
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
