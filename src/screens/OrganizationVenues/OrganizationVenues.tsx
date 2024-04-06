import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationVenues.module.css';
import { errorHandler } from 'utils/errorHandler';
import { useMutation, useQuery } from '@apollo/client';
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
import { Navigate, useParams } from 'react-router-dom';
import VenueModal from 'components/Venues/VenueModal';
import { Dropdown, Form } from 'react-bootstrap';
import { Search, Sort, Edit } from '@mui/icons-material';
import { DELETE_VENUE_MUTATION } from 'GraphQl/Mutations/VenueMutations';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    maxWidth: '500px',
    overflow: 'auto',
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

  document.title = t('title');
  const [venueModal, setVenueModal] = useState<boolean>(false);
  const [venueModalMode, setVenueModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');
  const [editVenueData, setEditVenueData] =
    useState<InterfaceQueryVenueListItem | null>(null);
  const [venues, setVenues] = useState<InterfaceQueryVenueListItem[]>([]);

  const { orgId } = useParams();
  if (!orgId) {
    return <Navigate to="/orglist" />;
  }

  const {
    data: venueData,
    loading: venueLoading,
    error: venueError,
    refetch: venueRefetch,
  } = useQuery(VENUE_LIST, {
    variables: { id: orgId },
  });

  const [deleteVenue] = useMutation(DELETE_VENUE_MUTATION);

  const handleDelete = async (venueId: string): Promise<void> => {
    try {
      await deleteVenue({
        variables: { id: venueId },
      });
      venueRefetch();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (order: 'highest' | 'lowest'): void => {
    setSortOrder(order);
  };

  const toggleVenueModal = (): void => {
    setVenueModal(!venueModal);
  };

  const showEditVenueModal = (venueItem: InterfaceQueryVenueListItem): void => {
    setVenueModalMode('edit');
    setEditVenueData(venueItem);
    toggleVenueModal();
  };

  const showCreateVenueModal = (): void => {
    setVenueModalMode('create');
    setEditVenueData(null);
    toggleVenueModal();
  };

  if (venueError) {
    console.log(venueError);
    errorHandler(t, venueError);
  }

  useEffect(() => {
    if (
      venueData &&
      venueData.organizations &&
      venueData.organizations[0] &&
      venueData.organizations[0].venues
    ) {
      setVenues(venueData.organizations[0].venues);
    }
  }, [venueData]);

  const filteredVenues = venues
    .filter((venue) => venue.name.includes(searchTerm))
    .sort((a, b) => {
      if (sortOrder === 'highest') {
        return parseInt(b.capacity) - parseInt(a.capacity);
      } else {
        return parseInt(a.capacity) - parseInt(b.capacity);
      }
    });

  return (
    <>
      <div className={styles.btnsContainer}>
        <div className={styles.input}>
          <Form.Control
            type="name"
            id="searchByName"
            className="bg-white"
            placeholder={t('searchByName')}
            data-testid="searchByName"
            autoComplete="off"
            required
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className={styles.btnsBlock}>
          <div className="d-flex">
            <Dropdown
              aria-expanded="false"
              title="Sort Venues"
              data-testid="sort"
            >
              <Dropdown.Toggle variant={'success'} data-testid="sortVenues">
                <Sort className={'me-1'} />
                {t('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={(): void => handleSortChange('highest')}
                  data-testid="highest"
                >
                  {t('highestCapacity')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(): void => handleSortChange('lowest')}
                  data-testid="lowest"
                >
                  {t('lowestCapacity')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Button
            variant="success"
            className="mx-2"
            onClick={showCreateVenueModal}
            data-testid="showCreateVenueModalBtn"
          >
            <i className="fa fa-plus me-1"></i> {t('addVenue')}
          </Button>
        </div>
      </div>

      <Col>
        <div className={styles.mainpageright}>
          {venueLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <div className={styles.list_box} data-testid="orgvenueslist">
              <Col>
                <TableContainer component={Paper} sx={{ minWidth: '540px' }}>
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
                        filteredVenues.map(
                          (
                            venueItem: InterfaceQueryVenueListItem,
                            index: number,
                          ) => (
                            <StyledTableRow
                              key={venueItem._id}
                              data-testid={`venueRow${index + 1}`}
                            >
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                {venueItem.name}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {venueItem.description}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {venueItem.capacity}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <div>
                                  <Button
                                    data-testid="updateVenueModalBtn"
                                    className="me-2"
                                    onClick={() => {
                                      showEditVenueModal(venueItem);
                                    }}
                                  >
                                    <Edit className="me-2" />
                                    {t('edit')}
                                  </Button>
                                  <Button
                                    data-testid="deleteVenueBtn"
                                    onClick={() => handleDelete(venueItem._id)}
                                  >
                                    <i className="fa fa-trash me-2" />
                                    {t('delete')}
                                  </Button>
                                </div>
                              </StyledTableCell>
                            </StyledTableRow>
                          ),
                        )
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell>
                            <h6>{t('noVenues')}</h6>
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
      <VenueModal
        show={venueModal}
        onHide={toggleVenueModal}
        refetchVenues={venueRefetch}
        orgId={orgId}
        edit={venueModalMode === 'edit' ? true : false}
        venueData={editVenueData}
      />
    </>
  );
}

export default organizationVenues;
