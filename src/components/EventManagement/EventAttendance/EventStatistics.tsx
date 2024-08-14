import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Modal,
  Button,
  ButtonGroup,
  Tooltip,
  OverlayTrigger,
  Dropdown
} from 'react-bootstrap';
import 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import {
  EVENT_DETAILS,
  ORGANIZATION_EVENT_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { useLazyQuery } from '@apollo/client';
import { exportToPDF, exportToCSV } from 'utils/chartToPdf';

interface InterfaceAttendanceStatisticsModalProps {
  show: boolean;
  handleClose: () => void;
  statistics: {
    totalMembers: number;
    membersAttended: number;
    attendanceRate: number;
  };
  memberData: InterfaceMember[];
}

interface InterfaceMember {
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  eventsAttended?: {
    _id: string;
  }[];
  birthDate: Date;
  __typename: string;
  _id: string;
  tagsAssignedWith: {
    edges: {
      node: {
        name: string;
      };
    }[];
  };
}

interface InterfaceEvent {
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
  recurrenceRule: {
    recurrenceStartDate: string;
    recurrenceEndDate?: string | null;
    frequency: string;
    weekDays: string[];
    interval: number;
    count?: number;
    weekDayOccurenceInMonth?: number;
  };
  isRecurringEventException: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
  attendees: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    birthDate: string;
  }[];
  __typename: string;
}

export const AttendanceStatisticsModal: React.FC<
  InterfaceAttendanceStatisticsModalProps
> = ({ show, handleClose, statistics, memberData, eventId }): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState('Gender');
  const { orgId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 10;

  const eventIdPrefix = eventId?.slice(0, 10).toString();
  const [loadEventDetails, { data: eventData }] = useLazyQuery(EVENT_DETAILS);
  const [loadRecurringEvents, { data: recurringData }] = useLazyQuery(
    ORGANIZATION_EVENT_CONNECTION_LIST,
  );

  useEffect(() => {
    if (eventId) {
      loadEventDetails({ variables: { id: eventId } });
    }
  }, [eventId, loadEventDetails]);

  useEffect(() => {
    if (eventIdPrefix && orgId) {
      loadRecurringEvents({
        variables: {
          organization_id: orgId,
          id_starts_with: eventIdPrefix,
          orderBy: 'startDate_DESC',
          first: eventsPerPage,
          skip: currentPage * eventsPerPage,
        },
      });
    }
  }, [eventIdPrefix, orgId, loadRecurringEvents, currentPage]);

  const isEventRecurring = eventData?.event?.recurring;

  const attendeeCounts = useMemo(
    () =>
      recurringData?.eventsByOrganizationConnection.map(
        (event: InterfaceEvent) => event.attendees.length,
      ) || [],
    [recurringData],
  );
  const eventLabels = useMemo(
    () =>
      recurringData?.eventsByOrganizationConnection.map(
        (event: InterfaceEvent) =>
          new Date(event.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
      ) || [],
    [recurringData],
  );
  const maleCounts = useMemo(
    () =>
      recurringData?.eventsByOrganizationConnection.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.gender === 'MALE')
            .length,
      ) || [],
    [recurringData],
  );
  const femaleCounts = useMemo(
    () =>
      recurringData?.eventsByOrganizationConnection.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.gender === 'FEMALE')
            .length,
      ) || [],
    [recurringData],
  );
  const otherCounts = useMemo(
    () =>
      recurringData?.eventsByOrganizationConnection.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.gender === 'OTHER')
            .length,
      ) || [],
    [recurringData],
  );

  const chartData = useMemo(
    () => ({
      labels: eventLabels,
      datasets: [
        {
          label: 'Attendee Count',
          data: attendeeCounts,
          fill: true,
          borderColor: '#008000',
        },
        {
          label: 'Male Attendees',
          data: maleCounts,
          fill: false,
          borderColor: '#0000FF',
        },
        {
          label: 'Female Attendees',
          data: femaleCounts,
          fill: false,
          borderColor: '#FF1493',
        },
        {
          label: 'Other Attendees',
          data: otherCounts,
          fill: false,
          borderColor: '#FFD700',
        },
      ],
    }),
    [eventLabels, attendeeCounts, maleCounts, femaleCounts, otherCounts],
  );

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const categoryLabels = useMemo(
    () =>
      selectedCategory === 'Gender'
        ? ['Male', 'Female', 'Other']
        : ['Under 18', '18-40', 'Over 40'],
    [selectedCategory],
  );
  const categoryData = useMemo(
    () =>
      selectedCategory === 'Gender'
        ? [
            memberData.filter((member) => member.gender === 'MALE').length,
            memberData.filter((member) => member.gender === 'FEMALE').length,
            memberData.filter((member) => member.gender === 'OTHER').length,
          ]
        : [
            memberData.filter(
              (member) =>
                new Date().getFullYear() -
                  new Date(member.birthDate).getFullYear() <
                18,
            ).length,
            memberData.filter((member) => {
              const age =
                new Date().getFullYear() -
                new Date(member.birthDate).getFullYear();
              return age >= 18 && age <= 40;
            }).length,
            memberData.filter(
              (member) =>
                new Date().getFullYear() -
                  new Date(member.birthDate).getFullYear() >
                40,
            ).length,
          ],
    [selectedCategory, memberData],
  );

  const handleCategoryChange = useCallback((category: string): void => {
    setSelectedCategory(category);
  }, []);
  const exportTrendsToCSV = useCallback(() => {
    const headers = [
      'Date',
      'Attendee Count',
      'Male Attendees',
      'Female Attendees',
      'Other Attendees',
    ];
    const data = [
      headers,
      ...eventLabels.map((label, index) => [
        label,
        attendeeCounts[index],
        maleCounts[index],
        femaleCounts[index],
        otherCounts[index],
      ]),
    ];
    exportToCSV(data, 'attendance_trends.csv');
  }, [eventLabels, attendeeCounts, maleCounts, femaleCounts, otherCounts]);

  const exportDemographicsToCSV = useCallback(() => {
    const headers = [selectedCategory, 'Count'];
    const data = [
      headers,
      ...categoryLabels.map((label, index) => [label, categoryData[index]]),
    ];
    exportToCSV(data, `${selectedCategory.toLowerCase()}_demographics.csv`);
  }, [selectedCategory, categoryLabels, categoryData]);
  const handleExport = (eventKey: string | null) => {
    switch (eventKey) {
      case 'pdf':
        exportToPDF('pdf-content', 'attendance_statistics');
        break;
      case 'trends':
        exportTrendsToCSV();
        break;
      case 'demographics':
        exportDemographicsToCSV();
        break;
    }
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="attendance-modal"
      size={isEventRecurring ? 'xl' : undefined}
    >
      <Modal.Header closeButton className="bg-success">
        <Modal.Title className="text-white">Attendance Statistics</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="w-100 d-flex flex-column align-items-center position-relative"
        id="pdf-content"
      >
        <div
          className="w-100 d-flex justify-content-end align-baseline position-absolute"
          style={{ top: '10px', right: '15px', zIndex: 1 }}
        >
          <Dropdown onSelect={handleExport}>
            <Dropdown.Toggle variant="success" id="dropdown-export" className='p-1'>
               Export
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="pdf">Export PDF</Dropdown.Item>
              {isEventRecurring && (
                <Dropdown.Item eventKey="trends">Export Trends CSV</Dropdown.Item>
              )}
              <Dropdown.Item eventKey="demographics">Export Demographics CSV</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="w-100 border border-success d-flex flex-row rounded">
          {isEventRecurring ? (
            <div
              className="text-success position-relative align-items-center justify-content-center w-50 border-right-1 border-success"
              style={{ borderRight: '1px solid green' }}
            >
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } },
                }}
                style={{ paddingBottom: '40px' }}
              />
              <div
                className="px-1 border border-success w-30"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  borderTopLeftRadius: 12,
                }}
              >
                <p className="text-black">Trends</p>
              </div>
              <div
                className="d-flex position-absolute bottom-2 end-50 translate-middle-y"
                style={{ paddingBottom: '2.5rem' }}
              >
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-prev">Previous Page</Tooltip>}
                >
                  <Button
                    className="p-0 rounded-circle w-10 me-2"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                  >
                    <img
                      src="/images/svg/arrow-left.svg"
                      alt="left-arrow"
                      width={20}
                      height={20}
                    />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-next">Next Page</Tooltip>}
                >
                  <Button
                    className="p-0 rounded-circle ms-2"
                    onClick={handleNextPage}
                  >
                    <img
                      src="/images/svg/arrow-right.svg"
                      alt="right-arrow"
                      width={20}
                      height={20}
                    />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          ) : (
            <div
              className="text-success position-relative d-flex align-items-center justify-content-center w-50 border-right-1 border-success"
              style={{ borderRight: '1px solid green' }}
            >
              <h1
                className="font-weight-bold"
                style={{ fontSize: 80, fontWeight: 40 }}
              >
                {statistics.totalMembers}
              </h1>
              <div
                className="px-1 border border-success"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  borderTopLeftRadius: 12,
                }}
              >
                <p className="text-black">Attendance Count</p>
              </div>
            </div>
          )}
          <div className="text-success position-relative d-flex flex-column align-items-center justify-content-start w-50">
            <ButtonGroup className="mt-2 pb-2 p-2">
              <Button
                variant={selectedCategory === 'Gender' ? 'success' : 'light'}
                className="border border-success p-2 pl-2"
                onClick={() => handleCategoryChange('Gender')}
              >
                Gender
              </Button>
              <Button
                variant={selectedCategory === 'Age' ? 'success' : 'light'}
                className="border border-success border-left-0 p-2"
                onClick={() => handleCategoryChange('Age')}
              >
                Age
              </Button>
            </ButtonGroup>
            <Bar
              className="mb-5"
              options={{ responsive: true }}
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    label:
                      selectedCategory === 'Gender'
                        ? 'Gender Distribution'
                        : 'Age Distribution',
                    data: categoryData,
                    backgroundColor: [
                      'rgba(40, 167, 69, 0.2)',
                      'rgba(57, 255, 20, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                      'rgba(40, 167, 69, 1)',
                      'rgba(57, 255, 20, 0.2)',
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
            />
            <div
              className="px-1 border border-success"
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                borderTopRightRadius: 8,
              }}
            >
              <p className="text-black">Demography</p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
