import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Modal,
  Button,
  ButtonGroup,
  Tooltip,
  OverlayTrigger,
  Dropdown,
} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartToolTip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import { useLazyQuery } from '@apollo/client';
import { exportToCSV } from 'utils/chartToPdf';
import type { ChartOptions, TooltipItem } from 'chart.js';
import type {
  InterfaceAttendanceStatisticsModalProps,
  InterfaceEvent,
  InterfaceRecurringEvent,
} from './InterfaceEvents';
import styles from '../../../style/app.module.css';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartToolTip,
  Legend,
);
/**
 * Component to display statistical information about event attendance
 * Shows metrics like total attendees, filtering options, and attendance trends
 * @returns JSX element with event statistics dashboard
 */

export const AttendanceStatisticsModal: React.FC<
  InterfaceAttendanceStatisticsModalProps
> = ({ show, handleClose, statistics, memberData, t }): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState('Gender');
  const { orgId, eventId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 10;
  const [loadEventDetails, { data: eventData }] = useLazyQuery(EVENT_DETAILS);
  const [loadRecurringEvents, { data: recurringData }] =
    useLazyQuery(RECURRING_EVENTS);
  const isEventRecurring = eventData?.event?.recurring;
  const currentEventIndex = useMemo(() => {
    if (!recurringData?.getRecurringEvents || !eventId) return -1;
    return recurringData.getRecurringEvents.findIndex(
      (event: InterfaceEvent) => event._id === eventId,
    );
  }, [recurringData, eventId]);
  useEffect(() => {
    if (currentEventIndex >= 0) {
      const newPage = Math.floor(currentEventIndex / eventsPerPage);
      setCurrentPage(newPage);
    }
  }, [currentEventIndex, eventsPerPage]);
  const filteredRecurringEvents = useMemo(
    () => recurringData?.getRecurringEvents || [],
    [recurringData],
  );
  const totalEvents = filteredRecurringEvents.length;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  const paginatedRecurringEvents = useMemo(() => {
    const startIndex = currentPage * eventsPerPage;
    const endIndex = Math.min(startIndex + eventsPerPage, totalEvents);
    return filteredRecurringEvents.slice(startIndex, endIndex);
  }, [filteredRecurringEvents, currentPage, eventsPerPage, totalEvents]);

  const attendeeCounts = useMemo(
    () =>
      paginatedRecurringEvents.map(
        (event: InterfaceEvent) => event.attendees.length,
      ),
    [paginatedRecurringEvents],
  );
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: { y: { beginAtZero: true } },
    plugins: {
      tooltip: {
        callbacks: {
          label:
            /*istanbul ignore next*/
            (context: TooltipItem<'line'>) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              const isCurrentEvent =
                paginatedRecurringEvents[context.dataIndex]._id === eventId;
              return isCurrentEvent
                ? `${label}: ${value} (Current Event)`
                : `${label}: ${value}`;
            },
        },
      },
    },
  };
  const eventLabels = useMemo(
    () =>
      paginatedRecurringEvents.map((event: InterfaceEvent) => {
        const date = (() => {
          try {
            const eventDate = new Date(event.startDate);
            if (Number.isNaN(eventDate.getTime())) {
              console.error(`Invalid date for event: ${event._id}`);

              return 'Invalid date';
            }
            return eventDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
          } catch (error) {
            console.error(
              `Error formatting date for event: ${event._id}`,
              error,
            );

            return 'Invalid date';
          }
        })();
        // Highlight the current event in the label
        return event._id === eventId ? `→ ${date}` : date;
      }),
    [paginatedRecurringEvents, eventId],
  );

  const maleCounts = useMemo(
    () =>
      paginatedRecurringEvents.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.gender === 'MALE')
            .length,
      ),
    [paginatedRecurringEvents],
  );

  const femaleCounts = useMemo(
    () =>
      paginatedRecurringEvents.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.gender === 'FEMALE')
            .length,
      ),
    [paginatedRecurringEvents],
  );

  const otherCounts = useMemo(
    () =>
      paginatedRecurringEvents.map(
        (event: InterfaceEvent) =>
          event.attendees.filter(
            (attendee) =>
              attendee.gender === 'OTHER' || attendee.gender === null,
          ).length,
      ),
    [paginatedRecurringEvents],
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
          pointRadius: paginatedRecurringEvents.map(
            (event: InterfaceRecurringEvent) => (event._id === eventId ? 8 : 3),
          ),
          pointBackgroundColor: paginatedRecurringEvents.map(
            (event: InterfaceRecurringEvent) =>
              event._id === eventId ? '#008000' : 'transparent',
          ),
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

  const handlePreviousPage = useCallback(
    /*istanbul ignore next*/
    () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    },
    [],
  );

  const handleNextPage = useCallback(
    /*istanbul ignore next*/
    () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    },
    [currentPage, totalPages],
  );

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      setCurrentPage(0);
    }
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
            memberData.filter(
              (member) =>
                member.gender === 'OTHER' ||
                member.gender === null ||
                member.gender === '',
            ).length,
          ]
        : [
            memberData.filter((member) => {
              const today = new Date();
              const birthDate = new Date(member.birthDate);
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                /*istanbul ignore next*/
                age--;
              }
              return age < 18;
            }).length,
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
      ...eventLabels.map((label: string, index: number) => [
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

  const handleExport = (eventKey: string | null): void => {
    switch (eventKey) {
      case 'trends':
        try {
          exportTrendsToCSV();
        } catch (error) {
          console.error('Failed to export trends:', error);
        }
        break;
      case 'demographics':
        try {
          exportDemographicsToCSV();
        } catch (error) {
          console.error('Failed to export demographics:', error);
        }
        break;
      default:
        return;
    }
  };
  useEffect(() => {
    if (eventId) {
      loadEventDetails({ variables: { id: eventId } });
    }
  }, [eventId, loadEventDetails]);
  useEffect(() => {
    if (eventId && orgId && eventData?.event?.baseRecurringEvent?._id) {
      loadRecurringEvents({
        variables: {
          baseRecurringEventId: eventData?.event?.baseRecurringEvent?._id,
        },
      });
    }
  }, [eventId, orgId, eventData, loadRecurringEvents]);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="attendance-modal"
      centered
      size={isEventRecurring ? 'xl' : 'lg'}
      data-testid="attendance-modal"
    >
      <Modal.Header closeButton className="bg-success">
        <Modal.Title className="text-white" data-testid="modal-title">
          {t('historical_statistics')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="w-100 d-flex flex-column align-items-center position-relative"
        id="pdf-content"
      >
        <div
          className={`${styles.positionedTopRight} w-100 d-flex justify-content-end align-baseline position-absolute`}
        ></div>
        <div className="w-100 border border-success d-flex flex-row rounded">
          {isEventRecurring ? (
            <div
              className={`${styles.borderRightGreen} text-success position-relative pt-4 align-items-center justify-content-center w-50 border-right-1 border-success`}
            >
              <Line
                data={chartData}
                options={chartOptions}
                className={`${styles.paddingBottom30}`}
              />
              <div
                className={`${styles.topRightCorner} px-1 border border-success w-30`}
              >
                <p className="text-black">Trends</p>
              </div>
              <div
                className={`${styles.paddingBottom2Rem} d-flex position-absolute bottom-1 end-50 translate-middle-y`}
                role="navigation"
                aria-label="Chart page navigation"
              >
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-prev">Previous Page</Tooltip>}
                >
                  <Button
                    className="p-0"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    aria-label="Previous page"
                  >
                    <img
                      src="/images/svg/arrow-left.svg"
                      alt="left-arrow"
                      width={20}
                      height={20}
                    />
                  </Button>
                </OverlayTrigger>
                <Button
                  data-testid="today-button"
                  className="p-1 ms-2"
                  onClick={() => handleDateChange(new Date())}
                  aria-label="Go to today"
                >
                  Today
                </Button>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-next">Next Page</Tooltip>}
                >
                  <Button
                    className="p-0 ms-2"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    aria-label="Next page"
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
              className={`${styles.borderRightGreen} text-success position-relative d-flex align-items-center justify-content-center w-50 border-right-1 border-success`}
            >
              <h1 className={`${styles.largeBoldText} font-weight-bold`}>
                {statistics.totalMembers}
              </h1>
              <div
                className={`${styles.bottomRightCorner} px-1 border border-success`}
              >
                <p className="text-black">Attendance Count</p>
              </div>
            </div>
          )}
          <div className="text-success position-relative d-flex flex-column align-items-center justify-content-start w-50">
            <ButtonGroup className="mt-2 pb-2 p-2">
              <Button
                data-testid="gender-button"
                variant={selectedCategory === 'Gender' ? 'success' : 'light'}
                className="border border-success p-2 pl-2"
                onClick={() => handleCategoryChange('Gender')}
              >
                Gender
              </Button>
              <Button
                data-testid="age-button"
                variant={selectedCategory === 'Age' ? 'success' : 'light'}
                className="border border-success border-left-0 p-2"
                onClick={() => handleCategoryChange('Age')}
              >
                Age
              </Button>
            </ButtonGroup>
            <Bar
              className="mb-3"
              options={{ responsive: true, animation: false }}
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
                      'rgba(31, 119, 180, 0.2)', // Blue
                      'rgba(255, 127, 14, 0.2)', // Orange
                      'rgba(44, 160, 44, 0.2)', // Green
                      'rgba(214, 39, 40, 0.2)', // Red
                      'rgba(148, 103, 189, 0.2)', // Purple
                      'rgba(140, 86, 75, 0.2)', // Brown
                    ],
                    borderColor: [
                      'rgba(31, 119, 180, 1)',
                      'rgba(255, 127, 14, 1)',
                      'rgba(44, 160, 44, 1)',
                      'rgba(214, 39, 40, 1)',
                      'rgba(148, 103, 189, 1)',
                      'rgba(140, 86, 75, 1)',
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
            />
            <div
              className={`${styles.topLeftCorner} px-1 border border-success`}
            >
              <p className="text-black">Demography</p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="p-0 m-2">
        <Dropdown data-testid="export-dropdown" onSelect={handleExport}>
          <Dropdown.Toggle
            className="p-2 m-2"
            variant="info"
            id="export-dropdown"
          >
            Export Data
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {isEventRecurring && (
              <Dropdown.Item data-testid="trends-export" eventKey="trends">
                Trends
              </Dropdown.Item>
            )}
            <Dropdown.Item
              data-testid="demographics-export"
              eventKey="demographics"
            >
              Demographics
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button
          className="p-2 m-2"
          variant="secondary"
          onClick={handleClose}
          data-testid="close-button"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
