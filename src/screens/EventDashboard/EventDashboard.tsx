<<<<<<< HEAD
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import styles from './EventDashboard.module.css';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { LeftDrawerEventWrapper } from 'components/LeftDrawerEvent/LeftDrawerEventWrapper';
import { Navigate, useParams } from 'react-router-dom';
=======
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import { Container } from 'react-bootstrap';
import styles from './EventDashboard.module.css';
import { AddEventProjectModal } from 'components/EventProjectModals/AddEventProjectModal';
import { UpdateEventProjectModal } from 'components/EventProjectModals/UpdateEventProjectModal';
import { DeleteEventProjectModal } from 'components/EventProjectModals/DeleteEventProjectModal';
import { AddTaskModal } from 'components/TaskModals/AddTaskModal';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import Button from 'react-bootstrap/Button';
import List from '@mui/material/List';
import { TaskListItem } from 'components/TaskListItem/TaskListItem';
import Loader from 'components/Loader/Loader';
import { LeftDrawerEventWrapper } from 'components/LeftDrawerEvent/LeftDrawerEventWrapper';

interface InterfaceEventTask {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  volunteers: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
}
interface InterfaceEventProject {
  _id: string;
  title: string;
  description: string;
  tasks: InterfaceEventTask[];
}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const EventDashboard = (): JSX.Element => {
  // Get the Event ID from the URL
  document.title = 'Event Dashboard';

<<<<<<< HEAD
  const { eventId } = useParams();
  if (!eventId) {
    return <Navigate to={'/orglist'} />;
  }

  // Data fetching
  const { data: eventData, loading: eventInfoLoading } = useQuery(
    EVENT_DETAILS,
    {
      variables: { id: eventId },
    },
  );
=======
  const [eventId, setEventId] = useState('');

  useEffect(() => {
    setEventId(window.location.href.split('/')[4]);
  }, [window.location.href]);

  // Data fetching
  const {
    data: eventData,
    loading: eventInfoLoading,
    refetch: refetchEventData,
  } = useQuery(EVENT_DETAILS, {
    variables: { id: eventId },
  });

  const [currentProject, setCurrentProject] = useState({
    _id: '',
    title: '',
    description: '',
  });

  // State management for modals
  const [showAddEventProjectModal, setShowAddEventProjectModal] =
    useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showUpdateEventProjectModal, setShowUpdateEventProjectModal] =
    useState(false);
  const [showDeleteEventProjectModal, setShowDeleteEventProjectModal] =
    useState(false);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  // Render the loading screen
  if (eventInfoLoading) {
    return <Loader />;
  }

<<<<<<< HEAD
  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    return `${hours}:${minutes}`;
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = suffixes[day % 10] || suffixes[0];

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedDate = `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
    return formattedDate;
  }

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  return (
    <LeftDrawerEventWrapper
      event={eventData.event}
      key={`${eventData?.event._id || 'loading'}EventDashboard`}
<<<<<<< HEAD
    >
      <div className={styles.content}>
        <Row>
          <Col>
            <div className={styles.eventContainer}>
              <div className={styles.eventDetailsBox}>
                {/* Side Bar - Static Information about the Event */}
                <div className={styles.time}>
                  <p>
                    <b className={styles.startTime}>
                      {eventData.event.startTime !== null
                        ? `${formatTime(eventData.event.startTime)}`
                        : ``}
                    </b>{' '}
                    <span className={styles.startDate}>
                      {formatDate(eventData.event.startDate)}{' '}
                    </span>
                  </p>
                  <p className={styles.to}>TO</p>
                  <p>
                    <b className={styles.endTime}>
                      {' '}
                      {eventData.event.endTime !== null
                        ? `${formatTime(eventData.event.endTime)}`
                        : ``}
                    </b>{' '}
                    <span className={styles.endDate}>
                      {formatDate(eventData.event.endDate)}{' '}
                    </span>
                  </p>
                </div>
                <h4 className={styles.titlename}>{eventData.event.title}</h4>
                <p className={styles.description}>
                  {eventData.event.description}
                </p>
                <p className={styles.toporgloc}>
                  <b>Location:</b> <span>{eventData.event.location}</span>
                </p>
                <p className={styles.toporgloc}>
                  <b>Registrants:</b>{' '}
                  <span>{eventData.event.attendees.length}</span>
                </p>
                <br />
              </div>
            </div>
          </Col>
        </Row>
      </div>
=======
      setShowAddEventProjectModal={setShowAddEventProjectModal}
    >
      <Row>
        <Col sm={4}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              {/* Side Bar - Static Information about the Event */}
              <h4 className={styles.titlename}>{eventData.event.title}</h4>
              <p className={styles.description}>
                {eventData.event.description}
              </p>
              <p className={styles.toporgloc}>
                <b>Location:</b> {eventData.event.location}
              </p>
              <p className={styles.toporgloc}>
                <b>Start:</b> {eventData.event.startDate}{' '}
                {eventData.event.startTime !== null
                  ? `- ${eventData.event.startTime}`
                  : ``}
              </p>
              <p className={styles.toporgloc}>
                <b>End:</b> {eventData.event.endDate}{' '}
                {eventData.event.endTime !== null
                  ? `- ${eventData.event.endTime}`
                  : ``}
              </p>
              <p className={styles.toporgloc}>
                <b>Registrants:</b> {eventData.event.attendees.length}
              </p>
              <br />
            </div>
          </div>
        </Col>
        <Col sm={6} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
          {/* Main Screen Container */}
          <Container>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.titlename}>Event Projects</p>
              </Row>
              <Row>
                {eventData.event.projects.length == 0
                  ? `There are no active projects for this event!`
                  : null}
                {eventData.event.projects.map(
                  (project: InterfaceEventProject) => (
                    <Col sm={14} className="mb-5" key={project._id}>
                      <div className={`card ${styles.cardContainer}`}>
                        <div className="card-body">
                          <div className="text-center">
                            <p className={`pb-2 ${styles.counterNumber}`}>
                              {project.title}
                            </p>
                            <p className={styles.counterHead}>
                              {project.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <h5>Tasks</h5>
                        </div>
                        <List
                          sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                          }}
                        >
                          <div className="text-center">
                            {!project.tasks.length
                              ? `There are no tasks for this project.`
                              : null}
                          </div>
                          {project.tasks.map((task) => (
                            <TaskListItem
                              task={task}
                              organization={eventData.event.organization}
                              key={task._id}
                              refetchData={refetchEventData}
                            />
                          ))}
                        </List>
                        <div className="pr-3 mr-2">
                          <Button
                            type="button"
                            aria-label="editEventProject"
                            variant="success"
                            className="m-2 ml-3"
                            size="sm"
                            onClick={(): void => {
                              setCurrentProject(project);
                              setShowUpdateEventProjectModal(true);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            aria-label="deleteEventProject"
                            className="m-1"
                            size="sm"
                            onClick={(): void => {
                              setCurrentProject(project);
                              setShowDeleteEventProjectModal(true);
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </Button>
                          <Button
                            type="button"
                            variant="outline-success"
                            aria-label="addTask"
                            className="m-1 ml-8"
                            size="sm"
                            onClick={(): void => {
                              setCurrentProject(project);
                              setShowAddTaskModal(true);
                            }}
                          >
                            <i className="fa fa-plus"></i>
                          </Button>
                        </div>
                      </div>
                    </Col>
                  )
                )}
              </Row>
            </div>
          </Container>
        </Col>
      </Row>

      {/* Wrapper for Different Modals */}
      <AddEventProjectModal
        show={showAddEventProjectModal}
        handleClose={(): void => {
          setShowAddEventProjectModal(false);
        }}
        eventId={eventId}
        refetchData={refetchEventData}
      />

      <UpdateEventProjectModal
        show={showUpdateEventProjectModal}
        handleClose={(): void => {
          setShowUpdateEventProjectModal(false);
        }}
        refetchData={refetchEventData}
        project={currentProject}
      />

      <DeleteEventProjectModal
        show={showDeleteEventProjectModal}
        handleClose={(): void => {
          setShowDeleteEventProjectModal(false);
        }}
        refetchData={refetchEventData}
        project={currentProject}
      />

      <AddTaskModal
        show={showAddTaskModal}
        handleClose={(): void => {
          setShowAddTaskModal(false);
        }}
        refetchData={refetchEventData}
        projectId={currentProject._id}
      />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </LeftDrawerEventWrapper>
  );
};

export default EventDashboard;
