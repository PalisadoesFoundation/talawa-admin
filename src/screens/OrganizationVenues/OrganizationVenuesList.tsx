import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import NotFound from 'components/NotFound/NotFound';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationVenues.module.css';
import { toast } from 'react-toastify';
import { Search, Sort } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Loader from 'components/Loader/Loader';
import Modal from 'react-bootstrap/Modal';
import { UPDATE_VENUE_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { InterfaceQueryVenueListItem } from '../../utils/interfaces';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface InterfaceOrgPeopleListCardProps {
  key: number;
  id: string;
}

function organizationVenuesList(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenuesList',
  });

  document.title = t('title');

  const location = useLocation();
  const role = location?.state;

  const { orgId: currentUrl } = useParams();

  const [filterData, setFilterData] = useState([]);
  const [id, setId] = useState('');

  const {
    data: memberData,
    loading: memberLoading,
    error: memberError,
    refetch: memberRefetch,
  } = useQuery(VENUE_LIST);

  useEffect(() => {
    memberRefetch({
      ...filterData,
      venueId: currentUrl,
    });
  }, []);

  // console.log(memberError);
  // console.log(memberData);

  //   const handleFullNameSearchChange = (e: any): void => {
  //     /* istanbul ignore next */
  //     if (e.key === 'Enter') {
  //       const [firstName, lastName] = fullName.split(' ');

  //       const newFilterData = {
  //         firstName_contains: firstName ?? '',
  //         lastName_contains: lastName ?? '',
  //       };

  //       setFilterData(newFilterData);

  //       if (state === 0) {
  //         memberRefetch({
  //           ...newFilterData,
  //           orgId: currentUrl,
  //         });
  //       } else if (state === 1) {
  //         adminRefetch({
  //           ...newFilterData,
  //           orgId: currentUrl,
  //           admin_for: currentUrl,
  //         });
  //       } else {
  //         usersRefetch({
  //           ...newFilterData,
  //         });
  //       }
  //     }
  //   };

  const [update] = useMutation(UPDATE_VENUE_MUTATION);
  const [showUpdateAdminModal, setShowUpdateAdminModal] = React.useState(false);

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    capacity: '',
    imageURL: '',
  });

  console.log(id);

  const toggleUpdateAdminModal = (venueId: any): void => {
    setId(venueId); // Update the id state variable with the ID of the venue to be edited
    setShowUpdateAdminModal(!showUpdateAdminModal);
  };

  const editVenue = async (e: any): Promise<void> => {
    e.preventDefault();
    if (formState.name.trim().length > 0) {
      try {
        console.log('editVenue', currentUrl);

        const { data: editVenue } = await update({
          variables: {
            capacity: parseInt(formState.capacity),
            file: formState.imageURL,
            description: formState.description,
            name: formState.name,
            id: id,
          },
        });

        console.log(editVenue);
        console.log('editVenue');

        /* istanbul ignore next */
        if (editVenue) {
          toast.success(t('venueAdded'));
          toggleUpdateAdminModal('');
          setFormState({
            name: '',
            description: '',
            imageURL: '',
            capacity: '',
          });
          // setTimeout(() => {
          //       window.location.reload();
          //     }, 2000);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    }
    if (formState.name.trim().length === 0) {
      toast.warning('Venue title can not be blank!');
    }
  };

  const filteredVenues = [];
  for (const venue of memberData?.organizations[0]?.venues || []) {
    if (venue.organization._id == currentUrl) {
      filteredVenues.push(venue);
    }
  }
  // console.log(filteredVenues);

  return (
    <>
      <Col sm={9}>
        <div className={styles.mainpageright}>
          {memberLoading ? (
            <>
              <Loader />
            </>
          ) : (
            /* istanbul ignore next */
            <div className={styles.list_box} data-testid="orgpeoplelist">
              <Col sm={5}>
                <TableContainer component={Paper} sx={{ minWidth: '820px' }}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        {/* <StyledTableCell align="center">
                          Profile
                        </StyledTableCell> */}
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">
                          Description
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Capacity
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Actions
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberData ? (
                        filteredVenues?.map((datas: any, index: number) => (
                          <StyledTableRow key={datas._id}>
                            <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>

                            <StyledTableCell align="center">
                              {datas.name}
                              {/* </Link> */}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {datas.description}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {datas.capacity}
                            </StyledTableCell>
                            {/* <StyledTableCell align="center">
                              {datas._id}
                            </StyledTableCell> */}
                            <StyledTableCell>
                              <div>
                                <Button
                                  className={styles.memberfontcreatedbtn}
                                  data-testid="updateMemberModalBtn"
                                  onClick={() => {
                                    toggleUpdateAdminModal(datas._id);
                                  }}
                                >
                                  {t('update')}
                                </Button>
                                <hr></hr>
                                <Modal
                                  show={showUpdateAdminModal}
                                  onHide={() => {
                                    toggleUpdateAdminModal(datas._id);
                                  }}
                                >
                                  <Modal.Header>
                                    <p className={styles.titlemodal}>
                                      {t('eventDetails')}
                                    </p>
                                    <Button
                                      variant="danger"
                                      onClick={() => {
                                        toggleUpdateAdminModal(datas._id);
                                      }}
                                      data-testid="createVenueModalCloseBtn"
                                    >
                                      <i className="fa fa-times"></i>
                                    </Button>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form>
                                      <label htmlFor="eventtitle">
                                        {t('eventTitle')}
                                      </label>
                                      <Form.Control
                                        type="title"
                                        id="eventitle"
                                        placeholder={t('enterVenueName')}
                                        autoComplete="off"
                                        required
                                        value={formState.name}
                                        onChange={(e): void => {
                                          setFormState({
                                            ...formState,
                                            name: e.target.value,
                                          });
                                        }}
                                      />
                                      <label htmlFor="eventdescrip">
                                        {t('description')}
                                      </label>
                                      <Form.Control
                                        type="text"
                                        id="eventdescrip"
                                        placeholder={t('enterVenueDesc')}
                                        autoComplete="off"
                                        required
                                        value={formState.description}
                                        onChange={(e): void => {
                                          setFormState({
                                            ...formState,
                                            description: e.target.value,
                                          });
                                        }}
                                      />
                                      <label htmlFor="eventLocation">
                                        {t('location')}
                                      </label>
                                      <Form.Control
                                        type="text"
                                        id="eventLocation"
                                        placeholder={t('enterVenueCapacity')}
                                        autoComplete="off"
                                        required
                                        value={formState.capacity}
                                        onChange={(e): void => {
                                          setFormState({
                                            ...formState,
                                            capacity: e.target.value,
                                          });
                                        }}
                                      />
                                      {/* Image to be added */}
                                      <Button
                                        type="submit"
                                        className={styles.greenregbtn}
                                        value="editVenue"
                                        data-testid="createVenueBtn"
                                        onClick={editVenue}
                                        key={datas._id}
                                      >
                                        {t('editVenue')}
                                      </Button>
                                    </Form>
                                  </Modal.Body>
                                </Modal>
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <NotFound title={'member'} keyPrefix="userNotFound" />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Col>
            </div>
          )}
        </div>
      </Col>
    </>
  );
}

export default organizationVenuesList;
