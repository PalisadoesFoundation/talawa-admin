import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app.module.css';
import { errorHandler } from 'utils/errorHandler';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import Loader from 'components/Loader/Loader';
import { Navigate, useParams } from 'react-router-dom';
import VenueModal from 'components/Venues/VenueModal';
import { Form } from 'react-bootstrap';
import { Search } from '@mui/icons-material';
import { DELETE_VENUE_MUTATION } from 'GraphQl/Mutations/VenueMutations';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import VenueCard from 'components/Venues/VenueCard';
import SortingButton from 'subComponents/SortingButton';

/**
 * Component to manage and display the list of organization venues.
 * Handles searching, sorting, and CRUD operations for venues.
 */
function organizationVenues(): JSX.Element {
  // Translation hooks for i18n support
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });
  const { t: tCommon } = useTranslation('common');

  // Setting the document title using the translation hook
  document.title = t('title');

  // State hooks for managing component state
  const [venueModal, setVenueModal] = useState<boolean>(false);
  const [venueModalMode, setVenueModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'desc'>('name');
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');
  const [editVenueData, setEditVenueData] =
    useState<InterfaceQueryVenueListItem | null>(null);
  const [venues, setVenues] = useState<InterfaceQueryVenueListItem[]>([]);

  // Getting the organization ID from the URL parameters
  const { orgId } = useParams();
  if (!orgId) {
    return <Navigate to="/orglist" />;
  }

  // GraphQL query for fetching venue data
  const {
    data: venueData,
    loading: venueLoading,
    error: venueError,
    refetch: venueRefetch,
  } = useQuery(VENUE_LIST, {
    variables: {
      orgId: orgId,
      orderBy: sortOrder === 'highest' ? 'capacity_DESC' : 'capacity_ASC',
      where: {
        name_starts_with: searchBy === 'name' ? searchTerm : undefined,
        description_starts_with: searchBy === 'desc' ? searchTerm : undefined,
      },
    },
  });

  // GraphQL mutation for deleting a venue
  const [deleteVenue] = useMutation(DELETE_VENUE_MUTATION);

  /**
   * Handles the deletion of a venue by ID.
   * @param venueId - The ID of the venue to delete.
   */
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

  /**
   * Updates the search term state when the user types in the search input.
   * @param event - The input change event.
   */
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (value: string): void => {
    setSearchBy(value as 'name' | 'desc');
  };

  /**
   * Updates the sort order state when the user selects a sort option.
   * @param value - The order to sort venues by (highest or lowest capacity).
   */
  const handleSortChange = (value: string): void => {
    setSortOrder(value as 'highest' | 'lowest');
  };

  /**
   * Toggles the visibility of the venue modal.
   */
  const toggleVenueModal = (): void => {
    setVenueModal(!venueModal);
  };

  /**
   * Shows the edit venue modal with the selected venue data.
   * @param venueItem - The venue data to edit.
   */
  const showEditVenueModal = (venueItem: InterfaceQueryVenueListItem): void => {
    setVenueModalMode('edit');
    setEditVenueData(venueItem);
    toggleVenueModal();
  };

  /**
   * Shows the create venue modal.
   */
  const showCreateVenueModal = (): void => {
    setVenueModalMode('create');
    setEditVenueData(null);
    toggleVenueModal();
  };

  // Error handling for venue data fetch
  if (venueError) {
    errorHandler(t, venueError);
  }

  // Updating venues state when venue data changes
  useEffect(() => {
    if (venueData && venueData.getVenueByOrgId) {
      setVenues(venueData.getVenueByOrgId);
    }
  }, [venueData]);

  return (
    <>
      <div className={`${styles.btnsContainer} gap-3 flex-wrap`}>
        <div className={`${styles.input}`}>
          <Form.Control
            type="name"
            id="searchByName"
            className={styles.inputField}
            placeholder={t('searchBy') + ' ' + tCommon(searchBy)}
            data-testid="searchBy"
            autoComplete="off"
            required
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button className={styles.searchButton} data-testid="searchBtn">
            <Search />
          </Button>
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <SortingButton
            title="SearchBy"
            sortingOptions={[
              { label: tCommon('name'), value: 'name' },
              { label: tCommon('description'), value: 'desc' },
            ]}
            selectedOption={tCommon(searchBy)}
            onSortChange={handleSearchByChange}
            dataTestIdPrefix="searchByDrpdwn"
            className={styles.dropdown} // Pass a custom class name if needed
          />
          <SortingButton
            title="Sort Venues"
            sortingOptions={[
              { label: t('highestCapacity'), value: 'highest' },
              { label: t('lowestCapacity'), value: 'lowest' },
            ]}
            selectedOption={t(
              sortOrder === 'highest' ? 'highestCapacity' : 'lowestCapacity',
            )}
            onSortChange={handleSortChange}
            dataTestIdPrefix="sortVenues"
            className={styles.dropdown} // Pass a custom class name if needed
          />
          <Button
            variant="success"
            className={styles.dropdown}
            onClick={showCreateVenueModal}
            data-testid="createVenueBtn"
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
            <div
              className={`${styles.list_box} row `}
              data-testid="orgvenueslist"
            >
              {venues.length ? (
                venues.map(
                  (venueItem: InterfaceQueryVenueListItem, index: number) => (
                    <VenueCard
                      venueItem={venueItem}
                      handleDelete={handleDelete}
                      showEditVenueModal={showEditVenueModal}
                      index={index}
                      key={index}
                    />
                  ),
                )
              ) : (
                <h6>{t('noVenues')}</h6>
              )}
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
