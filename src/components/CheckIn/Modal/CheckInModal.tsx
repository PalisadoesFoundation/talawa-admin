/**
 * Component for managing event check-ins in a modal.
 *
 * This component displays a modal that allows users to view and manage
 * the check-in status of attendees for a specific event. It fetches
 * attendee data using a GraphQL query and displays it in a searchable
 * and filterable table using the Material-UI DataGrid.
 *
 * @remarks
 * The component manages state for table data, user filter queries, and filter models.
 * It uses the EVENT_CHECKINS GraphQL query to fetch check-in data for the specified event.
 * The component integrates with Apollo Client for GraphQL queries, Material-UI for UI components
 * like DataGrid and TextField, React-Bootstrap for modal styling, and custom components
 * like `TableRow` for rendering check-in status.
 */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { EVENT_CHECKINS, EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { TableRow } from './Row/TableRow';
import type {
  InterfaceAttendeeCheckIn,
  InterfaceModalProp,
  InterfaceTableData,
} from 'types/CheckIn/interface';
import type {
  GridColDef,
  GridRowHeightReturnValue,
} from 'shared-components/DataGridWrapper';
import { DataGrid } from 'shared-components/DataGridWrapper';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import styles from 'style/app-fixed.module.css';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';
import { BaseModal } from 'shared-components/BaseModal';

export const CheckInModal = ({
  show,
  eventId,
  handleClose,
  onCheckInUpdate,
}: InterfaceModalProp): JSX.Element => {
  // State to hold the data for the table
  const [tableData, setTableData] = useState<InterfaceTableData[]>([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', { keyPrefix: 'checkIn' });

  // State for search filter input
  const [userFilterQuery, setUserFilterQuery] = useState('');

  // State for filter model used in DataGrid
  const [filterQueryModel, setFilterQueryModel] = useState({
    items: [{ field: 'userName', operator: 'contains', value: '' }],
  });

  // First, get event details to determine if it's recurring or standalone
  const { data: eventData } = useQuery(EVENT_DETAILS, {
    variables: { eventId: eventId },
    fetchPolicy: 'cache-first',
  });

  // Query to get check-in data from the server
  const {
    data: checkInData,
    loading: checkInLoading,
    refetch: checkInRefetch,
  } = useQuery(EVENT_CHECKINS, {
    variables: { eventId: eventId },
  });

  // Determine event type from event data
  useEffect(() => {
    if (eventData?.event) {
      setIsRecurring(!!eventData.event.recurrenceRule);
    }
  }, [eventData]);

  // Effect runs whenever checkInData, eventId, or checkInLoading changes
  useEffect(() => {
    checkInRefetch(); // Refetch data when component mounts or updates
    if (checkInLoading) {
      setTableData([]); // Clear table data while loading
    } else if (checkInData?.event?.attendeesCheckInStatus) {
      // Map the check-in data to table rows
      setTableData(
        checkInData.event.attendeesCheckInStatus.map(
          (checkIn: InterfaceAttendeeCheckIn) => ({
            userName: checkIn.user.name || 'Unknown User',
            id: checkIn.id,
            checkInData: {
              id: checkIn.id,
              name: checkIn.user.name || 'Unknown User',
              userId: checkIn.user.id,
              checkInTime: checkIn.checkInTime,
              checkOutTime: checkIn.checkOutTime,
              isCheckedIn: checkIn.isCheckedIn,
              isCheckedOut: checkIn.isCheckedOut,
              eventId,
              isRecurring: isRecurring,
            },
          }),
        ),
      );
    }
  }, [checkInData, eventId, checkInLoading, isRecurring]);

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'userName', headerName: 'User', width: 300 }, // Column for user names
    {
      field: 'checkInData',
      headerName: 'Check In Status',
      width: 400,
      renderCell: (props) => (
        // Render a custom row component for check-in status
        <TableRow
          data={props.value}
          refetch={checkInRefetch}
          onCheckInUpdate={onCheckInUpdate}
          // isRecurring={isRecurring}
        />
      ),
    },
  ];

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={handleClose}
    >
      <BaseModal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered={true}
        size="lg"
        headerClassName={styles.checkInModalHeader}
        headerContent={
          <div className="text-tableHeader-color" data-testid="modal-title">
            Event Check In Management
          </div>
        }
      >
        <div className="p-2">
          <SearchBar
            placeholder={t('searchAttendees')}
            value={userFilterQuery}
            onChange={(value) => {
              setUserFilterQuery(value);
              setFilterQueryModel({
                items: [
                  {
                    field: 'userName',
                    operator: 'contains',
                    value,
                  },
                ],
              });
            }}
            onClear={() => {
              setUserFilterQuery('');
              setFilterQueryModel({
                items: [{ field: 'userName', operator: 'contains', value: '' }],
              });
            }}
            showSearchButton={false}
            inputTestId="searchAttendees"
            clearButtonTestId="clearSearchAttendees"
          />
        </div>
        <div className={styles.checkInDataGridContainer}>
          <DataGrid
            rows={tableData}
            getRowHeight={(): GridRowHeightReturnValue => 'auto'}
            columns={columns}
            filterModel={filterQueryModel}
          />
        </div>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};
