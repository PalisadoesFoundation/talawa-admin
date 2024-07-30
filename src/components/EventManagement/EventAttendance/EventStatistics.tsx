import React, { useEffect, useState } from 'react';
import { Modal, Button, ButtonGroup } from 'react-bootstrap';
import 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useLazyQuery } from '@apollo/client';

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

export const AttendanceStatisticsModal: React.FC<InterfaceAttendanceStatisticsModalProps> = ({ show, handleClose, statistics, memberData }): JSX.Element => {
  console.log('stats', memberData);
  const [selectedCategory, setSelectedCategory] = useState('Gender');
  const { eventId } = useParams<{ eventId: string }>();
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
};
  const { data: eventData, refetch: eventRefetch } = useLazyQuery(
    EVENT_DETAILS,
    {
      variables: {
        id: eventId,
      },
    },
  )[1];

  useEffect(() => {
    eventRefetch({
      id: eventId,
    });
  }, [eventId, eventRefetch]);

  const isEventRecurring = eventData?.event?.recurring;
  console.log('Event Recurring Status:', isEventRecurring);
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept'],
    datasets: [
      {
        label: 'Attendee Count',
        data: [33, 25, 35, 51, 54, 76, 67, 56, 40],
        fill: true,
        borderColor: '#008000',
      },
    ],
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="attendance-modal"
      size={isEventRecurring ? 'lg' : undefined}
    >
      <Modal.Header closeButton className="bg-success">
        <Modal.Title>Attendance Statistics</Modal.Title>
      </Modal.Header>
      <Modal.Body className="w-100 d-flex flex-column align-items-center w-80">
        <div className="w-100 border border-success d-flex flex-row rounded">
          {isEventRecurring ? (
            <div
              className="text-success position-relative d-flex align-items-center justify-content-center w-50 border-right-1 border-success"
              style={{ borderRight: '1px solid green' }}
            >
              <Line
                data={data}
                options={{ maintainAspectRatio: false, responsive: true }}
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
          <div className="text-success position-relative d-flex flex-column align-items-center justify-content-start w-50 ">
            <ButtonGroup className="mt-2 pb-2">
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
            <Doughnut
              options={{ responsive: true }}
              data={{
                datasets: [
                  {
                    label:
                      selectedCategory === 'Gender'
                        ? 'Gender Distribution'
                        : 'Age Distribution',
                    data:
                      selectedCategory === 'Gender'
                        ? [
                            memberData.filter(
                              (member: InterfaceMember) =>
                                member.gender === 'MALE',
                            ).length,
                            memberData.filter(
                              (member: InterfaceMember) =>
                                member.gender === 'FEMALE',
                            ).length,
                            memberData.filter(
                              (member: InterfaceMember) =>
                                member.gender === 'OTHER',
                            ).length,
                          ]
                        : [
                            memberData.filter(
                              (member: InterfaceMember) =>
                                new Date().getFullYear() -
                                  new Date(member.birthDate).getFullYear() <
                                18,
                            ).length,
                            memberData.filter(
                              (member: InterfaceMember) =>
                                new Date().getFullYear() -
                                  new Date(member.birthDate).getFullYear() >=
                                  18 &&
                                new Date().getFullYear() -
                                  new Date(member.birthDate).getFullYear() <=
                                  40,
                            ).length,
                            memberData.filter(
                              (member: InterfaceMember) =>
                                new Date().getFullYear() -
                                  new Date(member.birthDate).getFullYear() >
                                40,
                            ).length,
                          ],
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
            <div className="d-flex align-items-center justify-content-between w-100 px-2 mt-2 mb-5">
              {selectedCategory === 'Gender' && (
                <div
                  className={
                    isEventRecurring
                      ? 'd-flex w-100  align-items-center justify-content-between  px-2'
                      : ' '
                  }
                >
                  <p>
                    <span
                      style={{
                        backgroundColor: 'rgba(40, 167, 69, 1)',
                        padding: '1px 8px',
                        borderRadius: '2px',
                        marginRight: '2px',
                      }}
                    ></span>{' '}
                    Men:{' '}
                    {
                      memberData.filter(
                        (member: InterfaceMember) => member.gender === 'MALE',
                      ).length
                    }
                  </p>
                  <p>
                    <span
                      style={{
                        backgroundColor: 'rgba(57, 255, 20, 1)',
                        padding: '1px 8px',
                        borderRadius: '2px',
                        marginRight: '2px',
                      }}
                    ></span>{' '}
                    Women:{' '}
                    {
                      memberData.filter(
                        (member: InterfaceMember) => member.gender === 'FEMALE',
                      ).length
                    }
                  </p>
                  <p>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        padding: '1px 8px',
                        borderRadius: '2px',
                        marginRight: '2px',
                      }}
                    ></span>{' '}
                    Other:{' '}
                    {
                      memberData.filter(
                        (member: InterfaceMember) => member.gender === 'OTHER',
                      ).length
                    }
                  </p>
                </div>
              )}
              {selectedCategory === 'Age' && (
                <div
                  className={
                    isEventRecurring
                      ? 'd-flex w-100  align-items-center justify-content-between  px-2'
                      : ' '
                  }
                >
                  <p className="text-sm">
                    <span
                      style={{
                        backgroundColor: 'rgba(40, 167, 69, 1)',
                        padding: '1px 8px',
                        borderRadius: '2px',
                        marginRight: '2px',
                      }}
                    ></span>{' '}
                    Under 18:{' '}
                    {
                      memberData.filter(
                        (member: InterfaceMember) =>
                          new Date().getFullYear() -
                            new Date(member.birthDate).getFullYear() <
                          18,
                      ).length
                    }
                  </p>
                  <p className="text-sm">
                    <span
                      style={{
                        backgroundColor: 'rgba(57, 255, 20, 0.2)',
                        padding: '1px 8px',
                        borderRadius: '2px',
                        marginRight: '2px',
                      }}
                    ></span>{' '}
                    19-40:{' '}
                    {
                      memberData.filter(
                        (member: InterfaceMember) =>
                          new Date().getFullYear() -
                            new Date(member.birthDate).getFullYear() >=
                            18 &&
                          new Date().getFullYear() -
                            new Date(member.birthDate).getFullYear() <=
                            40,
                      ).length
                    }
                  </p>
                  <p className="text-sm">
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        padding: '1px 8px',
                        borderRadius: '2px',
                        marginRight: '2px',
                      }}
                    ></span>{' '}
                    40+:{' '}
                    {
                      memberData.filter(
                        (member: InterfaceMember) =>
                          new Date().getFullYear() -
                            new Date(member.birthDate).getFullYear() >
                          40,
                      ).length
                    }
                  </p>
                </div>
              )}
            </div>
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
