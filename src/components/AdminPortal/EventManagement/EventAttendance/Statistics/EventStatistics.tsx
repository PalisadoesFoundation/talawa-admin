/**
 * AttendanceStatisticsModal Component
 *
 * This component displays attendance statistics for events, including trends and demographic data.
 * It supports both recurring and non-recurring events, providing a detailed view of attendee data.
 *
 * Features:
 * - Displays attendance trends using a line chart for recurring events.
 * - Shows demographic distribution (Gender or Age) using a bar chart.
 * - Supports pagination for navigating through recurring events.
 * - Allows exporting data (Trends and Demographics) to CSV format.
 * - Highlights the current event in the trends chart.
 *
 * Props:
 * @param  show - Determines whether the modal is visible.
 * @param  handleClose - Callback to close the modal.
 * @param statistics - Contains overall statistics for non-recurring events.
 * @param  memberData - List of members with demographic details.
 * @param  t - Translation function for localized strings.
 *
 * Hooks:
 * - `useParams` to retrieve organization and event IDs from the URL.
 * - `useLazyQuery` to fetch event details and recurring event data using GraphQL queries.
 * - `useMemo` and `useCallback` for optimized calculations and event handlers.
 *
 * Charts:
 * - Line chart for attendance trends (recurring events).
 * - Bar chart for demographic distribution (Gender or Age).
 *
 * Export:
 * - Provides options to export trends and demographic data as CSV files.
 *
 * Accessibility:
 * - Includes navigation buttons for pagination with tooltips for better usability.
 *
 * Dependencies:
 * - React, React-Bootstrap, React-ChartJS-2, Apollo Client, and utility functions.
 */
// translation-check-keyPrefix: eventAttendance
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import DropDownButton from 'shared-components/DropDownButton';
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
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
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
const DESIGN_TOKEN = {
  BW: 2,
} as const;

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

// translation-check-keyPrefix: eventAttendance
export const AttendanceStatisticsModal: React.FC<
  InterfaceAttendanceStatisticsModalProps
> = ({ show, handleClose, statistics, memberData }): React.JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventAttendance',
  });
  const { t: tErrors } = useTranslation('errors');
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
            const iso =
              event.startAt ??
              (event.allDay && event.startDate
                ? `${event.startDate}T00:00:00Z`
                : null);

            if (!iso) {
              return 'Invalid date';
            }

            const eventDate = new Date(iso);
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
          borderColor: 'var(--color-green-500)',
        },
        {
          label: t('maleAttendees'),
          data: maleCounts,
          fill: false,
          borderColor: 'var(--color-blue-500)',
        },
        {
          label: t('femaleAttendees'),
          data: femaleCounts,
          fill: false,
          borderColor: 'var(--color-red-500)',
        },
        {
          label: t('otherAttendees'),
          data: otherCounts,
          fill: false,
          borderColor: 'var(--color-yellow-500)',
        },
      ],
    }),
    [eventLabels, attendeeCounts, maleCounts, femaleCounts, otherCounts],
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

  const exportOptions = useMemo(
    () => [
      ...(showTrends ? [{ value: 'trends', label: t('trends') }] : []),
      { value: 'demographics', label: t('demographics') },
    ],
    [showTrends, t],
  );

  const modalFooter = (
    <>
      <DropDownButton
        id="export-dropdown"
        options={exportOptions}
        onSelect={handleExport}
        buttonLabel={t('exportData')}
        dataTestIdPrefix="export"
        variant="info"
        parentContainerStyle="p-2 m-2"
      />
      <Button
        style={{ padding: '0.5rem', margin: '0.5rem' }}
        variant="secondary"
        onClick={handleClose}
        data-testid="close-button"
      >
        {t('close')}
      </Button>
    </>
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <BaseModal
        show={show}
        onHide={handleClose}
        className="attendance-modal"
        centered={true}
        size={showTrends ? 'xl' : 'lg'}
        dataTestId="attendance-modal"
        footerClassName="p-0 m-2"
        footer={modalFooter}
        headerClassName={styles.modalHeader}
        title={t('historical_statistics')}
        bodyClassName={styles.modalBody}
      >
        <div
          className={styles.positionedTopRight}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'baseline',
            position: 'absolute',
          }}
        ></div>
        <div
          style={{
            width: '100%',
            border: '1px solid var(--green-500, #3ecf8e)',
            display: 'flex',
            flexDirection: 'row',
            borderRadius: '0.375rem',
          }}
        >
          {showTrends ? (
            <div
              className={`${styles.borderRightGreen} ${styles.chartContainer}`}
              style={{
                color: 'var(--green-500, #3ecf8e)',
                position: 'relative',
                paddingTop: '1.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
              }}
            >
              <Line
                data={chartData}
                options={chartOptions}
                className={styles.paddingBottom30}
                height={400}
              />
              <div
                className={styles.topRightCorner}
                style={{
                  padding: '0 0.25rem',
                  border: '1px solid var(--green-500, #3ecf8e)',
                }}
              >
                <p style={{ color: '#000' }}>{t('trends')}</p>
              </div>
              <div
                className={styles.paddingBottom2Rem}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  bottom: '0.25rem',
                }}
                role="navigation"
                aria-label={t('chartPageNavigation')}
              >
                <Button
                  style={{ padding: 0 }}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  aria-label={t('previousPage')}
                  title={t('previousPage')}
                >
                  <img
                    src="/images/svg/arrow-left.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  data-testid="today-button"
                  style={{ padding: '0.25rem', marginLeft: '0.5rem' }}
                  onClick={() => handleDateChange(new Date())}
                  aria-label={t('goToToday')}
                >
                  {t('today')}
                </Button>
                <Button
                  style={{ padding: 0, marginLeft: '0.5rem' }}
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  aria-label={t('nextPage')}
                  title={t('nextPage')}
                >
                  <img
                    src="/images/svg/arrow-right.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={styles.borderRightGreen}
              style={{
                color: 'var(--green-500, #3ecf8e)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
              }}
            >
              <h1
                className={styles.largeBoldText}
                style={{ fontWeight: 'bold' }}
              >
                {statistics.totalMembers}
              </h1>
              <div
                className={styles.bottomRightCorner}
                style={{
                  padding: '0 0.25rem',
                  border: '1px solid var(--green-500, #3ecf8e)',
                }}
              >
                <p style={{ color: '#000' }}>{t('attendanceCount')}</p>
              </div>
            </div>
          )}
          <div
            style={{
              color: 'var(--green-500, #3ecf8e)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '50%',
            }}
          >
            <div
              style={{
                marginTop: '0.5rem',
                paddingBottom: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
              }}
            >
              <Button
                data-testid="gender-button"
                variant={selectedCategory === 'Gender' ? 'success' : 'light'}
                style={{
                  border: '1px solid var(--green-500, #3ecf8e)',
                  padding: '0.5rem',
                }}
                onClick={() => handleCategoryChange('Gender')}
              >
                {t('gender')}
              </Button>
              <Button
                data-testid="age-button"
                variant={selectedCategory === 'Age' ? 'success' : 'light'}
                style={{
                  border: '1px solid var(--green-500, #3ecf8e)',
                  borderLeft: 'none',
                  padding: '0.5rem',
                }}
                onClick={() => handleCategoryChange('Age')}
              >
                {t('age')}
              </Button>
            </div>
            <Bar
              style={{ marginBottom: '1rem' }}
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
                    backgroundColor: [
                      'var(--color-blue-200)',
                      'var(--color-yellow-500)',
                      'var(--color-green-500)',
                      'var(--color-red-500)',
                      'var(--color-purple-500)',
                      'var(--color-brown-500)',
                    ],
                    borderColor: [
                      'var(--color-blue-500)',
                      'var(--color-yellow-500)',
                      'var(--color-green-500)',
                      'var(--color-red-500)',
                      'var(--color-purple-500)',
                      'var(--color-brown-500)',
                    ],
                    borderWidth: DESIGN_TOKEN.BW,
                  },
                ],
              }}
            />
            <div
              className={styles.topLeftCorner}
              style={{
                padding: '0 0.25rem',
                border: '1px solid var(--green-500, #3ecf8e)',
              }}
            >
              <p style={{ color: '#000' }}>{t('demography')}</p>
            </div>
          </div>
        </div>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};
