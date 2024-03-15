// import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationVenues.module.css';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import convertToBase64 from 'utils/convertToBase64';
import { useQuery, useMutation } from '@apollo/client';
import type { OperationVariables } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Loader from 'components/Loader/Loader';

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

function organizationVenues(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });

  document.title = t('venueTitle');
  const [venuemodalisOpen, setvenueModalIsOpen] = useState(false);
  const [postPhotoUpdated, setPostPhotoUpdated] = useState(false);

  const [createFormState, setCreateFormState] = useState({
    name: '',
    description: '',
    capacity: '',
    imageURL: '',
  });
  const currentUrl = window.location.pathname.split('/').pop();

  const showInviteModal = (): void => {
    setvenueModalIsOpen(true);
  };
  const hideInviteModal = (): void => {
    setvenueModalIsOpen(false);
  };

  const clearImageInput = (): void => {
    setFormState({
      ...formState,
      imageURL: '',
    });
    setPostPhotoUpdated(true);
    const fileInput = document.getElementById(
      'postImageUrl',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const [create] = useMutation(CREATE_VENUE_MUTATION);

  const createVenue = async (e: any): Promise<void> => {
    e.preventDefault();
    if (createFormState.name.trim().length > 0) {
      try {
        const { data: addVenue } = await create({
          variables: {
            capacity: parseInt(createFormState.capacity),
            file: createFormState.imageURL,
            description: createFormState.description,
            name: createFormState.name,
            organizationId: currentUrl,
          },
        });

        if (addVenue) {
          toast.success(t('venueAdded'));
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error: any) {
        errorHandler(t, error);
      }
    }
    if (createFormState.name.trim().length === 0) {
      toast.warning('Venue title can not be blank!');
    }
  };

  const filterData: Partial<OperationVariables> | undefined = [];
  const [id, setId] = useState('');

  const {
    data: memberData,
    loading: memberLoading,
    refetch: memberRefetch,
  } = useQuery(VENUE_LIST);

  useEffect(() => {
    memberRefetch({
      ...filterData,
      orgId: currentUrl,
    });
  }, []);

  const [update] = useMutation(UPDATE_VENUE_MUTATION);
  const [showUpdateAdminModal, setShowUpdateAdminModal] = React.useState(false);

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    capacity: '',
    imageURL: '',
  });

  const toggleUpdateAdminModal = (orgId: any): void => {
    setId(orgId);
    setShowUpdateAdminModal(!showUpdateAdminModal);
  };

  const editVenue = async (e: any): Promise<void> => {
    e.preventDefault();
    if (formState.name.trim().length > 0) {
      try {
        const { data: editVenue } = await update({
          variables: {
            capacity: parseInt(formState.capacity),
            file: formState.imageURL,
            description: formState.description,
            name: formState.name,
            id: id,
          },
        });

        if (editVenue) {
          toast.success(t('venueUpdated'));
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error: any) {
        errorHandler(t, error);
      }
    }
    if (formState.name.trim().length === 0) {
      toast.warning('Venue title can not be blank!');
    }
  };

  const filteredVenues = [];
  const organizationsLength = memberData?.organizations.length;
  for (let i = 0; i < organizationsLength; i++) {
    for (const venue of memberData?.organizations[i]?.venues || []) {
      if (venue.organization._id == currentUrl) {
        filteredVenues.push(venue);
      }
    }
  }

  return (
    <>
      <div className={styles.mainpageright}>
        <div className={styles.justifysp}>
          <p className={styles.logintitle}>{t('venueTitle')}</p>
          <Button
            variant="success"
            className={styles.addbtn}
            onClick={showInviteModal}
            data-testid="createVenueModalBtn"
          >
            <i className="fa fa-plus"></i> {t('addVenue')}
          </Button>
        </div>
      </div>

      {/* Create venue modal */}
      <Modal show={venuemodalisOpen} onHide={hideInviteModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('venueDetails')}</p>
          <Button
            variant="danger"
            onClick={hideInviteModal}
            data-testid="createVenueModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <label htmlFor="venuetitle">{t('venueName')}</label>
            <Form.Control
              type="title"
              id="venuetitle"
              placeholder={t('enterVenueName')}
              autoComplete="off"
              required
              value={createFormState.name}
              onChange={(e): void => {
                setCreateFormState({
                  ...createFormState,
                  name: e.target.value,
                });
              }}
            />
            <label htmlFor="venuedescrip">{t('description')}</label>
            <Form.Control
              type="text"
              id="venuedescrip"
              placeholder={t('enterVenueDesc')}
              autoComplete="off"
              required
              value={createFormState.description}
              onChange={(e): void => {
                setCreateFormState({
                  ...createFormState,
                  description: e.target.value,
                });
              }}
            />
            <label htmlFor="venuecapacity">{t('capacity')}</label>
            <Form.Control
              type="text"
              id="venuecapacity"
              placeholder={t('enterVenueCapacity')}
              autoComplete="off"
              required
              value={createFormState.capacity}
              onChange={(e): void => {
                setCreateFormState({
                  ...createFormState,
                  capacity: e.target.value,
                });
              }}
            />
            <Form.Label htmlFor="postPhoto">{t('image')}</Form.Label>
            <Form.Control
              accept="image/*"
              id="postImageUrl"
              data-testid="postImageUrl"
              name="postphoto"
              type="file"
              placeholder={t('uploadVenueImage')}
              multiple={false}
              onChange={async (
                e: React.ChangeEvent<HTMLInputElement>,
              ): Promise<void> => {
                setCreateFormState((prevPostFormState) => ({
                  ...prevPostFormState,
                  imageURL: '',
                }));
                setPostPhotoUpdated(true);
                const file = e.target.files?.[0];
                if (file) {
                  setCreateFormState({
                    ...createFormState,
                    imageURL: await convertToBase64(file),
                  });
                }
              }}
            />
            {postPhotoUpdated && (
              <div className={styles.preview}>
                <img src={createFormState.imageURL} alt="Post Image Preview" />
                <button
                  className={styles.closeButtonP}
                  onClick={clearImageInput}
                  data-testid="closeimage"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
            )}
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="createVenue"
              data-testid="createVenueBtn"
              onClick={createVenue}
            >
              {t('createVenue')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Col sm={9}>
        <div className={styles.mainpageright}>
          {memberLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <div className={styles.list_box} data-testid="orgpeoplelist">
              <Col sm={5}>
                <TableContainer component={Paper} sx={{ minWidth: '820px' }}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>#</StyledTableCell>
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
                      {filteredVenues.length ? (
                        filteredVenues?.map((datas: any, index: number) => (
                          <StyledTableRow
                            key={datas._id}
                            data-testid={`venueRow${index + 1}`}
                          >
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
                            <StyledTableCell align="center">
                              <div>
                                <Button
                                  data-testid="updateVenueModalBtn"
                                  onClick={() => {
                                    toggleUpdateAdminModal(datas._id);
                                  }}
                                >
                                  {t('update')}
                                </Button>
                                <Modal
                                  show={
                                    id === datas._id && showUpdateAdminModal
                                  }
                                  onHide={() => {
                                    toggleUpdateAdminModal(datas._id);
                                  }}
                                  data-testid="updateModal"
                                >
                                  <Modal.Header>
                                    <p className={styles.titlemodal}>
                                      {t('venueDetails')}
                                    </p>
                                    <Button
                                      variant="danger"
                                      onClick={() => {
                                        toggleUpdateAdminModal(datas._id);
                                      }}
                                      data-testid="updateVenueModalCloseBtn"
                                    >
                                      <i className="fa fa-times"></i>
                                    </Button>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form>
                                      <label htmlFor="eventtitle">
                                        {t('venueName')}
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
                                        {t('capacity')}
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
                                      <Form.Label htmlFor="postPhoto">
                                        {t('image')}
                                      </Form.Label>
                                      <Form.Control
                                        accept="image/*"
                                        id="postImageUrl"
                                        data-testid="postImageUrl"
                                        name="postphoto"
                                        type="file"
                                        placeholder={t('uploadVenueImage')}
                                        multiple={false}
                                        onChange={async (
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ): Promise<void> => {
                                          setFormState((prevPostFormState) => ({
                                            ...prevPostFormState,
                                            imageURL: '',
                                          }));
                                          setPostPhotoUpdated(true);
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            setFormState({
                                              ...formState,
                                              imageURL:
                                                await convertToBase64(file),
                                            });
                                          }
                                        }}
                                      />
                                      {postPhotoUpdated && (
                                        <div className={styles.preview}>
                                          <img
                                            src={formState.imageURL}
                                            alt="Post Image Preview"
                                          />
                                          <button
                                            className={styles.closeButtonP}
                                            onClick={clearImageInput}
                                            data-testid="closeimage"
                                          >
                                            <i className="fa fa-times"></i>
                                          </button>
                                        </div>
                                      )}
                                      <Button
                                        type="submit"
                                        className={styles.greenregbtn}
                                        value="editVenue"
                                        data-testid="updateVenueBtn"
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
                        <StyledTableRow>
                          <StyledTableCell>
                            <h6>No venue found!</h6>
                          </StyledTableCell>
                        </StyledTableRow>
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

export default organizationVenues;
