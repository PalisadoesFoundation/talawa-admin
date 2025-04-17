/**
 * Component for managing event check-ins in a modal.
 *
 * This component displays a modal that allows users to view and manage
 * the check-in status of attendees for a specific event. It fetches
 * attendee data using a GraphQL query and displays it in a searchable
 * and filterable table using the Material-UI DataGrid.
 *
 * @component
 * @param {InterfaceModalProp} props - The properties for the modal.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {string} props.eventId - The ID of the event for which check-ins are managed.
 * @param {() => void} props.handleClose - Callback to close the modal.
 *
 * @state {InterfaceTableData[]} tableData - Holds the data for the table rows.
 * @state {string} userFilterQuery - Stores the search input for filtering attendees.
 * @state {object} filterQueryModel - Defines the filter model for the DataGrid.
 *
 * @query {EVENT_CHECKINS} Fetches the check-in data for the specified event.
 *
 * @returns {JSX.Element} A modal containing a searchable and filterable table
 * of attendees and their check-in statuses.
 *
 * @dependencies
 * - React for state management and rendering.
 * - Apollo Client for GraphQL queries.
 * - Material-UI for UI components like DataGrid and TextField.
 * - React-Bootstrap for modal styling.
 * - Custom components like `TableRow` for rendering check-in status.
 *
 * @example
 * <CheckInModal
 *   show={true}
 *   eventId="event123"
 *   handleClose={() => console.log('Modal closed')}
 * />
 */
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import styles from '../../../style/app-fixed.module.css';
import { TableRow } from './Row/TableRow';
import type {
  InterfaceAttendeeCheckIn,
  InterfaceModalProp,
  InterfaceTableData,
} from 'types/CheckIn/interface';
import type { GridColDef, GridRowHeightReturnValue } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

export const CheckInModal = ({
  show,
  eventId,
  handleClose,
}: InterfaceModalProp): JSX.Element => {
  // State to hold the data for the table
  const [tableData, setTableData] = useState<InterfaceTableData[]>([]);

  // State for search filter input
  const [userFilterQuery, setUserFilterQuery] = useState('');

  // State for filter model used in DataGrid
  const [filterQueryModel, setFilterQueryModel] = useState({
    items: [{ field: 'userName', operator: 'contains', value: '' }],
  });

  // Query to get check-in data from the server
  const {
    data: checkInData,
    loading: checkInLoading,
    refetch: checkInRefetch,
  } = useQuery(EVENT_CHECKINS, {
    variables: { id: eventId },
  });

  // Effect runs whenever checkInData, eventId, or checkInLoading changes
  useEffect(() => {
    checkInRefetch(); // Refetch data when component mounts or updates
    if (checkInLoading) {
      setTableData([]); // Clear table data while loading
    } else {
      // Map the check-in data to table rows
      setTableData(
        checkInData.event.attendeesCheckInStatus.map(
          (checkIn: InterfaceAttendeeCheckIn) => ({
            userName: `${checkIn.user.firstName} ${checkIn.user.lastName}`,
            id: checkIn._id,
            checkInData: {
              id: checkIn._id,
              name: `${checkIn.user.firstName} ${checkIn.user.lastName}`,
              userId: checkIn.user._id,
              checkIn: checkIn.checkIn,
              eventId,
            },
          }),
        ),
      );
    }
  }, [checkInData, eventId, checkInLoading]);

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'userName', headerName: 'User', width: 300 }, // Column for user names
    {
      field: 'checkInData',
      headerName: 'Check In Status',
      width: 400,
      renderCell: (props) => (
        // Render a custom row component for check-in status
        <TableRow data={props.value} refetch={checkInRefetch} />
      ),
    },
  ];

  // Show a loading indicator while data is loading
  if (checkInLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" data-testid="modal-title">
            Event Check In Management
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-2">
            <TextField
              id="searchAttendees"
              label="Search Attendees"
              variant="outlined"
              value={userFilterQuery}
              onChange={(e): void => {
                setUserFilterQuery(e.target.value);
                setFilterQueryModel({
                  items: [
                    {
                      field: 'userName',
                      operator: 'contains',
                      value: e.target.value,
                    },
                  ],
                });
              }}
              fullWidth
            />
          </div>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={tableData}
              getRowHeight={(): GridRowHeightReturnValue => 'auto'}
              columns={columns}
              filterModel={filterQueryModel}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
