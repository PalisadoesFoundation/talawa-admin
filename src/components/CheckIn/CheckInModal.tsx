import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import styles from 'components/CheckIn/CheckInModal.module.css';
import { TableRow } from './TableRow';
import {
  AttendeeCheckInInterface,
  ModalPropInterface,
  TableDataInterface,
} from './types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

export const CheckInModal = (props: ModalPropInterface) => {
  const [tableData, setTableData] = useState<TableDataInterface[]>([]);

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
          (checkIn: AttendeeCheckInInterface) => ({
            userName: `${checkIn.user.firstName} ${checkIn.user.lastName}`,
            id: checkIn._id,
            checkInData: {
              id: checkIn._id,
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
      <Modal show={props.show} onHide={props.handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event Check In Management</Modal.Title>
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
          <div style={{ height: 550, width: '100%' }}>
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
