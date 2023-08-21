import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import styles from 'components/CheckIn/CheckInModal.module.css';
import { TableRow } from './TableRow';
import type {
  InterfaceAttendeeCheckIn,
  InterfaceModalProp,
  InterfaceTableData,
} from './types';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

export const CheckInModal = (props: InterfaceModalProp): JSX.Element => {
  const [tableData, setTableData] = useState<InterfaceTableData[]>([]);

  const [userFilterQuery, setUserFilterQuery] = useState('');
  const [filterQueryModel, setFilterQueryModel] = useState({
    items: [{ field: 'userName', operator: 'contains', value: '' }],
  });

  const {
    data: checkInData,
    loading: checkInLoading,
    refetch: checkInRefetch,
  } = useQuery(EVENT_CHECKINS, {
    variables: { id: props.eventId },
  });

  useEffect(() => {
    if (checkInLoading) setTableData([]);
    else
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
              eventId: props.eventId,
            },
          })
        )
      );
  }, [checkInData, props.eventId, checkInLoading]);

  const columns: GridColDef[] = [
    { field: 'userName', headerName: 'User', width: 300 },
    {
      field: 'checkInData',
      headerName: 'Check In Status',
      width: 400,
      renderCell: (props) => (
        <TableRow data={props.value} refetch={checkInRefetch} />
      ),
    },
  ];

  // Render the loading screen
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
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">
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
              onChange={(e) => {
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
              getRowHeight={() => 'auto'}
              columns={columns}
              filterModel={filterQueryModel}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
