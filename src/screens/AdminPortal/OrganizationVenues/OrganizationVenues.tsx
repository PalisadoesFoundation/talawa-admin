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
import {
  DeleteModal,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import VenueCard from 'components/AdminPortal/Venues/VenueCard';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';

/**
 * OrganizationVenues component
 *
 * @param refetchVenues - optional injected refetch function for tests
 * @param testExposeConfirm - expose a test-only confirm button when true
 */
function organizationVenues(props?: {
  refetchVenues?: () => Promise<unknown>;
  testExposeConfirm?: boolean;
}): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

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

  const { orgId } = useParams();
  if (!orgId) return <Navigate to="/admin/orglist" />;

  const {
    data: venueData,
    loading: venueLoading,
    error: venueError,
    refetch: venueRefetch,
  } = useQuery(VENUE_LIST, {
    variables: { orgId },
  });

  const [deleteVenue, { loading: deletingVenue }] = useMutation(
    DELETE_VENUE_MUTATION,
  );

  const {
    isOpen: deleteVenueModalOpen,
    open: openDeleteVenueModal,
    close: closeDeleteVenueModal,
  } = useModalState();

  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(
    null,
  );

  /**
   * Open delete confirmation for given venue id
   *
   * @param venueId - id of the venue to mark for deletion and confirm
   */
  const handleDelete = (venueId: string): void => {
    setSelectedVenueId(venueId);
    openDeleteVenueModal();
  };

  /**
   * Consolidated close handler for delete modal
   *
   * Clears any selected venue and closes the DeleteModal.
   */
  const handleCloseDeleteVenueModal = (): void => {
    setSelectedVenueId(null);
    closeDeleteVenueModal();
  };

  /**
   * Perform deletion for selected venue and refetch list
   *
   * This function is invoked when the user confirms deletion in the
   * DeleteModal. It performs the GraphQL mutation to delete the venue,
   * awaits a refetch of the venue list (either injected for tests or
   * from the query), and then cleans up modal state. Errors are routed
   * through the global errorHandler so UI can show localized messages.
   */
  const confirmDelete = async (): Promise<void> => {
    if (!selectedVenueId) return;
    try {
      await deleteVenue({ variables: { id: selectedVenueId } });
      const refetchFn = props?.refetchVenues ?? venueRefetch;
      await refetchFn();
      handleCloseDeleteVenueModal();
    } catch (error) {
      errorHandler(t, error);
    }
  };

  /**
   * Update search term state
   *
   * @param term - current search string
   */
  const handleSearch = (term: string): void => setSearchTerm(term);

  /**
   * Update which field to search by (name | description)
   *
   * @param value - selected search-by option
   */
  const handleSearchByChange = (value: string): void =>
    setSearchBy(value as 'name' | 'desc');

  /**
   * Update sort order for venue list
   *
   * @param value - 'highest' or 'lowest'
   */
  const handleSortChange = (value: string): void =>
    setSortOrder(value as 'highest' | 'lowest');

  /**
   * Toggle visibility of the Venue modal
   */
  const toggleVenueModal = (): void => setVenueModal(!venueModal);

  /**
   * Show the edit modal and populate it with the selected venue
   *
   * @param venueItem - the venue to edit
   */
  const showEditVenueModal = (venueItem: InterfaceQueryVenueListItem): void => {
    setVenueModalMode('edit');
    setEditVenueData(venueItem);
    toggleVenueModal();
  };

  /**
   * Show the create-venue modal
   */
  const showCreateVenueModal = (): void => {
    setVenueModalMode('create');
    setEditVenueData(null);
    toggleVenueModal();
  };

  if (venueError) {
    errorHandler(t, venueError);
  }

  /**
   * Synchronize query results into local state and apply client-side
   * filtering (search) and sorting (capacity) so the UI can render
   * paginated/filtered results quickly without refetching.
   */
  useEffect(() => {
    if (venueData?.organization?.venues?.edges) {
      let filteredVenues = venueData.organization.venues.edges;

      if (searchTerm) {
        filteredVenues = filteredVenues.filter(
          (venue: InterfaceQueryVenueListItem) => {
            if (searchBy === 'name') {
              return venue.node.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            }
            return venue.node.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          },
        );
      }

      if (filteredVenues.length > 0) {
        filteredVenues = [...filteredVenues].sort(
          (a: InterfaceQueryVenueListItem, b: InterfaceQueryVenueListItem) => {
            const capacityA = parseInt(String(a.node.capacity || '0'));
            const capacityB = parseInt(String(b.node.capacity || '0'));
            return sortOrder === 'highest'
              ? capacityB - capacityA
              : capacityA - capacityB;
          },
        );
      }

      setVenues(filteredVenues);
    }
  }, [venueData, searchTerm, searchBy, sortOrder]);

  return (
    <>
      <SafeBreadcrumbs
        items={[
          { translationKey: 'organization', to: `/admin/orgdash/${orgId}` },
          { translationKey: 'venues', isCurrent: true },
        ]}
      />

      <div className={`${styles.btnsContainer} gap-3 flex-wrap`}>
        <SearchFilterBar
          hasDropdowns
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
              <i className="fa fa-plus me-1" /> {t('addVenue')}
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
                venues.map((venueItem: InterfaceQueryVenueListItem) => (
                  <VenueCard
                    venueItem={venueItem}
                    showEditVenueModal={showEditVenueModal}
                    handleDelete={handleDelete}
                    key={venueItem.node.id}
                  />
                ))
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
        edit={venueModalMode === 'edit'}
        venueData={editVenueData}
      />

      {props?.testExposeConfirm ? (
        <Button
          variant="secondary"
          data-testid="test-confirm-delete"
          onClick={confirmDelete}
        >
          {t('testConfirmDelete')}
        </Button>
      ) : null}

      <DeleteModal
        open={deleteVenueModalOpen}
        title={t('deleteVenue')}
        onClose={handleCloseDeleteVenueModal}
        onDelete={confirmDelete}
        loading={deletingVenue}
        entityName={
          venues.find((v) => v.node.id === selectedVenueId)?.node.name ??
          undefined
        }
        data-testid="deleteVenueModal"
      />
    </>
  );
}

export default organizationVenues;
