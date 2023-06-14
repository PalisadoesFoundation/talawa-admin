import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import { Container } from 'react-bootstrap';
import styles from './EventDashboard.module.css';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import { AddEventProjectModal } from 'components/EventProjectModals/AddEventProjectModal';
import { UpdateEventProjectModal } from 'components/EventProjectModals/UpdateEventProjectModal';
import { DeleteEventProjectModal } from 'components/EventProjectModals/DeleteEventProjectModal';
import { AddTaskModal } from 'components/TaskModals/AddTaskModal';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import Button from 'react-bootstrap/Button';
import List from '@mui/material/List';
import { EventAttendeeWrapper } from 'components/EventAttendeesModal/EventAttendeeWrapper';
import { TaskListItem } from 'components/TaskListItem/TaskListItem';
import { CheckInWrapper } from 'components/CheckIn/CheckInWrapper';

interface EventTaskInterface {
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
interface EventProjectInterface {
  _id: string;
  title: string;
  description: string;
  tasks: EventTaskInterface[];
}

function EventDashboard(): JSX.Element {
  // Get the Event ID from the URL
  document.title = 'Event Dashboard';
  const eventId = window.location.href.split('/')[4];

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

  // Render the loading screen
  if (eventInfoLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <ListNavbar />
      <Row>
        <Col sm={3}>
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
                <b>Attendees:</b> {eventData.event.attendees.length}
              </p>
              <br />
              {/* Buttons to trigger different modals */}
              <p className={styles.tagdetailsGreen}>
                <Button
                  type="button"
                  className="mt-3"
                  variant="success"
                  aria-label="addEventProject"
                  onClick={() => {
                    setShowAddEventProjectModal(true);
                  }}
                >
                  Add an Event Project
                </Button>
                <EventAttendeeWrapper
                  eventId={eventId}
                  orgId={eventData.event.organization._id}
                />
                <CheckInWrapper eventId={eventId} />
              </p>
            </div>
          </div>
        </Col>
        <Col sm={8} className="mt-sm-0 mt-5 ml-4 ml-sm-0">
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
                  (project: EventProjectInterface) => (
                    <Col sm={4} className="mb-5" key={project._id}>
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
                            onClick={() => {
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
                            onClick={() => {
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
                            onClick={() => {
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
        handleClose={() => {
          setShowAddEventProjectModal(false);
        }}
        eventId={eventId}
        refetchData={refetchEventData}
      />

      <UpdateEventProjectModal
        show={showUpdateEventProjectModal}
        handleClose={() => {
          setShowUpdateEventProjectModal(false);
        }}
        refetchData={refetchEventData}
        project={currentProject}
      />

      <DeleteEventProjectModal
        show={showDeleteEventProjectModal}
        handleClose={() => {
          setShowDeleteEventProjectModal(false);
        }}
        refetchData={refetchEventData}
        project={currentProject}
      />

      <AddTaskModal
        show={showAddTaskModal}
        handleClose={() => {
          setShowAddTaskModal(false);
        }}
        refetchData={refetchEventData}
        projectId={currentProject._id}
      />
    </>
  );
}

export default EventDashboard;
