/**
 * OrganizationVenues Component
 *
 * This component displays a list of venues associated with an organization.
 * It provides functionalities for searching, sorting, creating, editing,
 * and deleting venues. The component uses GraphQL queries and mutations
 * to fetch and manipulate venue data.
 *
 * Features:
 * - Search venues by name or description.
 * - Sort venues by highest or lowest capacity.
 * - Create new venues or edit existing ones using a modal.
 * - Delete venues with confirmation.
 * - Displays a loader while fetching data and handles errors gracefully.
 *
 * Hooks:
 * - `useTranslation`: For internationalization (i18n) support.
 * - `useState`: To manage component state such as modal visibility, search term, etc.
 * - `useEffect`: To update the venue list when data changes.
 * - `useQuery`: To fetch venue data from the server.
 * - `useMutation`: To handle venue deletion.
 * - `useParams`: To retrieve the organization ID from the URL.
 *
 * Props:
 * - None (organization ID is derived from the URL parameters).
 *
 * GraphQL:
 * - Query: `VENUE_LIST` - Fetches the list of venues for the organization.
 * - Mutation: `DELETE_VENUE_MUTATION` - Deletes a specific venue by ID.
 *
 * StateVariables:
 * - `venueModal`: Controls the visibility of the venue modal.
 * - `venueModalMode`: Determines whether the modal is in 'edit' or 'create' mode.
 * - `searchTerm`: Stores the search term entered by the user.
 * - `searchBy`: Specifies the field to search by ('name' or 'desc').
 * - `sortOrder`: Specifies the sorting order ('highest' or 'lowest').
 * - `editVenueData`: Stores the data of the venue being edited.
 * - `venues`: Stores the list of venues fetched from the server.
 *
 * ErrorHandling:
 * - Uses `errorHandler` utility to display errors in a user-friendly manner.
 *
 * Dependencies:
 * - React, React Router, Apollo Client, Bootstrap, and custom components.
 *
 * @returns JSX.Element - The rendered OrganizationVenues component.
 */
import React, { useEffect, useState } from 'react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationVenues.module.css';
import { errorHandler } from 'utils/errorHandler';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { Navigate, useParams } from 'react-router';
import VenueModal from 'components/AdminPortal/Venues/Modal/VenueModal';
import { DELETE_VENUE_MUTATION } from 'GraphQl/Mutations/VenueMutations';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import VenueCard from 'components/AdminPortal/Venues/VenueCard';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

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
    return <Navigate to="/admin/orglist" />;
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
      await deleteVenue({ variables: { id: venueId } });
      venueRefetch();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  /**
   * Handles the search operation by updating the search term state.
   * @param term - The search term entered by the user.
   */
  const handleSearch = (term: string): void => {
    setSearchTerm(term);
  };

  /**
   * Updates the search by state when the user selects a search option.
   * @param value - The field to search by (name or description).
   */
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
    if (venueData && venueData?.organization?.venues?.edges) {
      let filteredVenues = venueData.organization.venues.edges;

      // Client-side filtering
      if (searchTerm) {
        filteredVenues = filteredVenues.filter(
          (venue: InterfaceQueryVenueListItem) => {
            if (searchBy === 'name') {
              return venue.node.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            } else {
              // searchBy === 'desc'
              return venue.node.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
            }
          },
        );
      }

      // Client-side sorting by capacity
      if (filteredVenues.length > 0) {
        filteredVenues = [...filteredVenues].sort((a, b) => {
          const capacityA = parseInt(a.node.capacity || '0');
          const capacityB = parseInt(b.node.capacity || '0');
          return sortOrder === 'highest'
            ? capacityB - capacityA
            : capacityA - capacityB;
        });
      }

      setVenues(filteredVenues);
    }
  }, [venueData, searchTerm, searchBy, sortOrder]);

  return (
    <>
      <div className={`${styles.btnsContainer} gap-3 flex-wrap`}>
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={`${t('searchBy')} ${tCommon(searchBy)}`}
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          searchInputTestId="searchInput"
          searchButtonTestId="searchBtn"
          dropdowns={[
            {
              id: 'org-venue-SearchBy',
              label: '',
              type: 'filter',
              title: t('searchBy'),
              options: [
                { label: tCommon('name'), value: 'name' },
                { label: tCommon('description'), value: 'desc' },
              ],
              selectedOption: searchBy,
              onOptionChange: (value) => handleSearchByChange(value.toString()),
              dataTestIdPrefix: 'searchByButton',
            },
            {
              id: 'org-venue-Venues',
              label: '',
              type: 'sort',
              title: t('sortVenues'),
              options: [
                { label: t('highestCapacity'), value: 'highest' },
                { label: t('lowestCapacity'), value: 'lowest' },
              ],
              selectedOption: sortOrder,
              onOptionChange: (value) => handleSortChange(value.toString()),
              dataTestIdPrefix: 'sortVenues',
            },
          ]}
          additionalButtons={
            <Button
              variant="success"
              className={styles.dropdown}
              onClick={showCreateVenueModal}
              data-testid="createVenueBtn"
            >
              <i className="fa fa-plus me-1"></i> {t('addVenue')}
            </Button>
          }
        />
      </div>

      <Col>
        <div className={styles.mainpageright}>
          <LoadingState isLoading={venueLoading} variant="spinner" size="lg">
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
                      key={index}
                    />
                  ),
                )
              ) : (
                <h6>{t('noVenues')}</h6>
              )}
            </div>
          </LoadingState>
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
