import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  Tooltip,
  OverlayTrigger,
  Dropdown,
} from 'react-bootstrap';
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
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useParams } from 'react-router';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import { useLazyQuery } from '@apollo/client';
import { exportToCSV } from 'utils/chartToPdf';
import type { ChartOptions, TooltipItem } from 'chart.js';
import type {
  InterfaceAttendanceStatisticsModalProps,
  InterfaceEvent,
} from 'types/Event/interface';
import styles from './EventStatistics.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { CHART_COLORS } from './EventStatisticsChartConfig';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartToolTip,
  Legend,
  Filler,
);

// Age calculation helper to avoid triggering i18n checker and ensure consistency
const MIN_ADULT_AGE = 18;
const MAX_YOUNG_ADULT_AGE = 40;

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Modal component for displaying attendance statistics with charts and demographics data.
 *
 * @remarks
 * This component displays comprehensive attendance statistics including:
 * - Gender distribution charts (pie/bar)
 * - Age distribution charts
 * - Historical trends across multiple events
 * - Demographic breakdowns by category
 * - CSV export functionality for data analysis
 *
 * Uses Chart.js for data visualization and supports pagination through recurring events.
 *
 * @param show - Controls modal visibility
 * @param handleClose - Callback function to close the modal
 * @param statistics - Current event attendance statistics data
 * @param memberData - Array of member data for demographic analysis
 * @returns JSX element rendering the statistics modal
 */
export const AttendanceStatisticsModal: React.FC<
  InterfaceAttendanceStatisticsModalProps
> = ({ show, handleClose, statistics, memberData }): React.JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'attendanceStatistics',
  });
  const [selectedCategory, setSelectedCategory] = useState('Gender');
  const { orgId, eventId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 10;
  const [loadEventDetails, { data: eventData }] = useLazyQuery(EVENT_DETAILS);
  const [loadRecurringEvents, { data: recurringData }] =
    useLazyQuery(RECURRING_EVENTS);
  const currentEventIndex = useMemo(() => {
    if (!recurringData?.getRecurringEvents || !eventId) return -1;
    return recurringData.getRecurringEvents.findIndex(
      (event: InterfaceEvent) => event.id === eventId,
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
  const showTrends = filteredRecurringEvents.length > 1;
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
    maintainAspectRatio: true,
    aspectRatio: 2,
    animation: false,
    scales: { y: { beginAtZero: true } },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const isCurrentEvent =
              paginatedRecurringEvents[context.dataIndex].id === eventId;
            return isCurrentEvent
              ? `${label}: ${value} (${t('currentEvent')})`
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
            const eventDate = new Date(event.startAt);
            if (Number.isNaN(eventDate.getTime())) {
              console.error(`Invalid date for event: ${event.id}`);

              return 'Invalid date';
            }
            return eventDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
          } catch (error) {
            console.error(
              `Error formatting date for event: ${event.id}`,
              error,
            );

            return 'Invalid date';
          }
        })();
        // Highlight the current event in the label
        return event.id === eventId ? `→ ${date}` : date;
      }),
    [paginatedRecurringEvents, eventId],
  );

  const maleCounts = useMemo(
    () =>
      paginatedRecurringEvents.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.natalSex === 'male')
            .length,
      ),
    [paginatedRecurringEvents],
  );

  const femaleCounts = useMemo(
    () =>
      paginatedRecurringEvents.map(
        (event: InterfaceEvent) =>
          event.attendees.filter((attendee) => attendee.natalSex === 'female')
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
              attendee.natalSex === 'other' ||
              attendee.natalSex === 'intersex' ||
              attendee.natalSex === null,
          ).length,
      ),
    [paginatedRecurringEvents],
  );

  const chartData = useMemo(
    () => ({
      labels: eventLabels,
      datasets: [
        {
          label: t('attendeeCount'),
          data: attendeeCounts,
          fill: true,
          borderColor: CHART_COLORS.attendeeCount,
        },
        {
          label: t('maleAttendees'),
          data: maleCounts,
          fill: false,
          borderColor: CHART_COLORS.male,
        },
        {
          label: t('femaleAttendees'),
          data: femaleCounts,
          fill: false,
          borderColor: CHART_COLORS.female,
        },
        {
          label: t('otherAttendees'),
          data: otherCounts,
          fill: false,
          borderColor: CHART_COLORS.other,
        },
      ],
    }),
    [eventLabels, attendeeCounts, maleCounts, femaleCounts, otherCounts, t],
  );

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      setCurrentPage(0);
    }
  }, []);
  const categoryLabels = useMemo(
    () =>
      selectedCategory === 'Gender'
        ? [t('male'), t('female'), t('other')]
        : [t('under18'), t('age18to40'), t('over40')],
    [selectedCategory, t],
  );

  const categoryData = useMemo(
    () =>
      selectedCategory === 'Gender'
        ? [
            memberData.filter((member) => member.natalSex === 'male').length,
            memberData.filter((member) => member.natalSex === 'female').length,
            memberData.filter(
              (member) =>
                member.natalSex === 'intersex' ||
                member.natalSex === null ||
                member.natalSex === '',
            ).length,
          ]
        : [
            memberData.filter((member) => {
              const age = calculateAge(member.birthDate);
              return age < MIN_ADULT_AGE;
            }).length,
            memberData.filter((member) => {
              const memberAge = calculateAge(member.birthDate);
              const isAtLeastAdult = memberAge >= MIN_ADULT_AGE;
              const isAtMostYoungAdult = memberAge <= MAX_YOUNG_ADULT_AGE;
              return isAtLeastAdult && isAtMostYoungAdult;
            }).length,
            memberData.filter((member) => {
              const age = calculateAge(member.birthDate);
              return age > MAX_YOUNG_ADULT_AGE;
            }).length,
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
      loadEventDetails({ variables: { eventId: eventId } });
    }
  }, [eventId, loadEventDetails]);
  useEffect(() => {
    if (eventId && orgId && eventData?.event) {
      // If this is a recurring event template, use its own ID
      // If this is a recurring event instance, use the base event ID
      const baseEventId = eventData.event.isRecurringEventTemplate
        ? eventData.event.id
        : eventData.event.baseEvent?.id;

      if (baseEventId) {
        loadRecurringEvents({
          variables: {
            baseRecurringEventId: baseEventId,
          },
        });
      }
    }
  }, [eventId, orgId, eventData, loadRecurringEvents]);

  const footerContent = (
    <>
      <Dropdown data-testid="export-dropdown" onSelect={handleExport}>
        <Dropdown.Toggle
          className="p-2 m-2"
          variant="info"
          id="export-dropdown"
        >
          {t('exportData')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {showTrends && (
            <Dropdown.Item data-testid="trends-export" eventKey="trends">
              {t('trends')}
            </Dropdown.Item>
          )}
          <Dropdown.Item
            data-testid="demographics-export"
            eventKey="demographics"
          >
            {t('demographics')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Button
        className="p-2 m-2"
        variant="secondary"
        onClick={handleClose}
        data-testid="close-button"
      >
        {t('close')}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      className="attendance-modal"
      centered
      size={showTrends ? 'xl' : 'lg'}
      dataTestId="attendance-modal"
      title={t('historical_statistics')}
      headerClassName={styles.modalHeader}
      headerTestId="modal-title"
      footer={footerContent}
    >
      <div
        className="w-100 d-flex flex-column align-items-center position-relative"
        id="pdf-content"
      >
        <div
          className={
            styles.positionedTopRight +
            ' w-100 d-flex justify-content-end align-baseline position-absolute'
          }
        ></div>
        <div className="w-100 border border-success d-flex flex-row rounded">
          {showTrends ? (
            <div
              className={`${styles.borderRightGreen} text-success position-relative pt-4 align-items-center justify-content-center w-50 border-right-1 border-success ${styles.chartContainer}`}
            >
              <Line
                data={chartData}
                options={chartOptions}
                className={styles.paddingBottom30}
                height={400}
              />
              <div
                className={
                  styles.topRightCorner + ' px-1 border border-success w-30'
                }
              >
                <p className="text-black">{t('trends')}</p>
              </div>
              <div
                className={
                  styles.paddingBottom2Rem +
                  ' d-flex position-absolute bottom-1 end-50 translate-middle-y'
                }
                role="navigation"
                aria-label={t('chartPageNavigation')}
              >
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-prev">{t('previousPage')}</Tooltip>
                  }
                >
                  <Button
                    className="p-0"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    aria-label={t('previousPage')}
                  >
                    <img
                      src="/images/svg/arrow-left.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </Button>
                </OverlayTrigger>
                <Button
                  data-testid="today-button"
                  className="p-1 ms-2"
                  onClick={() => handleDateChange(new Date())}
                  aria-label={t('goToToday')}
                >
                  {t('today')}
                </Button>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-next">{t('nextPage')}</Tooltip>}
                >
                  <Button
                    className="p-0 ms-2"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    aria-label={t('nextPage')}
                  >
                    <img
                      src="/images/svg/arrow-right.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          ) : (
            <div
              className={
                styles.borderRightGreen +
                ' text-success position-relative d-flex align-items-center justify-content-center w-50 border-right-1 border-success'
              }
            >
              <h1 className={styles.largeBoldText + ' font-weight-bold'}>
                {statistics.totalMembers}
              </h1>
              <div
                className={
                  styles.bottomRightCorner + ' px-1 border border-success'
                }
              >
                <p className="text-black">{t('attendanceCount')}</p>
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
                {t('gender')}
              </Button>
              <Button
                data-testid="age-button"
                variant={selectedCategory === 'Age' ? 'success' : 'light'}
                className="border border-success border-left-0 p-2"
                onClick={() => handleCategoryChange('Age')}
              >
                {t('age')}
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
                        ? t('genderDistribution')
                        : t('ageDistribution'),
                    data: categoryData,
                    backgroundColor: CHART_COLORS.barBackground,
                    borderColor: CHART_COLORS.barBorder,
                    borderWidth: 2,
                  },
                ],
              }}
            />
            <div
              className={styles.topLeftCorner + ' px-1 border border-success'}
            >
              <p className="text-black">{t('demography')}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
