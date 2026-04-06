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
import useVenueDeletion from '../../../hooks/useVenueDeletion';
import { DeleteModal } from 'shared-components/CRUDModalTemplate';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import VenueCard from 'components/AdminPortal/Venues/VenueCard';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';

export const getVenueNameById = (
  venues: InterfaceQueryVenueListItem[],
  venueId: string,
): string => {
  return (
    venues.find((venueItem) => venueItem.node.id === venueId)?.node.name ?? ''
  );
};

/**
 * OrganizationVenues component
 *
 * @param refetchVenues - optional injected refetch function for tests
 */
function organizationVenues(props?: {
  refetchVenues?: () => Promise<unknown>;
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

  const [deleteVenue] = useMutation(DELETE_VENUE_MUTATION);

  // Allow tests to inject a custom refetch function via props.refetchVenues.
  // Prefer the injected function when present, otherwise use the query's refetch.
  const deletion = useVenueDeletion(
    deleteVenue,
    props?.refetchVenues ?? venueRefetch,
  );

  const {
    open: handleDelete,
    close: handleCloseDeleteVenueModal,
    confirmDelete,
    isOpen: deleteVenueModalOpenHook,
    deleting: deletingHook,
  } = deletion;

  // Cache selected venue id and name locally to avoid scanning the venues array
  // on every render when the modal is rendered. This improves performance for
  // large lists and preserves the canonical deletion logic in the hook.
  const [selectedVenue, setSelectedVenue] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openDeleteModal = (venueId: string): void => {
    const venueName = getVenueNameById(venues, venueId);
    setSelectedVenue({ id: venueId, name: venueName });
    handleDelete(venueId);
  };

  const handleCloseAndClear = (): void => {
    setSelectedVenue(null);
    handleCloseDeleteVenueModal();
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

      <Toolbar
        search={{
          placeholder: `${t('searchBy')} ${tCommon(searchBy)}`,
          value: searchTerm,
          onChange: handleSearch,
          onSearch: handleSearch,
          inputTestId: 'searchInput',
          buttonTestId: 'searchBtn',
        }}
        filters={[
          {
            id: 'org-venue-SearchBy',
            label: '',
            type: 'filter',
            title: t('searchBy'),
            options: [
              { label: tCommon('name'), value: 'name' },
              { label: tCommon('description'), value: 'desc' },
            ],
            selected: searchBy,
            onChange: (value) => handleSearchByChange(value.toString()),
            testIdPrefix: 'searchByButton',
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
            selected: sortOrder,
            onChange: (value) => handleSortChange(value.toString()),
            testIdPrefix: 'sortVenues',
          },
        ]}
        actions={
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
                    handleDelete={openDeleteModal}
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

      <DeleteModal
        open={deleteVenueModalOpenHook}
        title={t('deleteVenue')}
        onClose={handleCloseAndClear}
        onDelete={confirmDelete}
        loading={deletingHook}
        entityName={selectedVenue?.name ?? undefined}
        data-testid="deleteVenueModal"
      />
    </>
  );
}

export default organizationVenues;
