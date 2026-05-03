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
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import { useMutation, useQuery } from '@apollo/client';
import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { Navigate, useParams } from 'react-router';
import VenueModal from 'components/AdminPortal/Venues/Modal/VenueModal';
import { DELETE_VENUE_MUTATION } from 'GraphQl/Mutations/VenueMutations';
import useVenueDeletion from '../../../hooks/useVenueDeletion';
import { DeleteModal } from 'shared-components/CRUDModalTemplate';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
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

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {t('title')}{' '}
            <span
              className="badge badge-gray"
              style={{ fontSize: '14px', verticalAlign: 'middle', marginLeft: '8px' }}
            >
              {venues.length}
            </span>
          </h1>
          <p className="page-subtitle">{t('manageVenues')}</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={showCreateVenueModal}
            data-testid="createVenueBtn"
          >
            + {t('addVenue')}
          </button>
        </div>
      </div>

      <div className="toolbar" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          className="search-input"
          placeholder={`${t('searchBy')} ${tCommon(searchBy)}`}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          data-testid="searchInput"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}
        />
        <select
          className="filter-dropdown"
          value={searchBy}
          onChange={(e) => handleSearchByChange(e.target.value)}
          data-testid="searchByButton-filter"
          style={{ padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', fontSize: '13px', background: 'var(--surface)' }}
        >
          <option value="name">{tCommon('name')}</option>
          <option value="desc">{tCommon('description')}</option>
        </select>
        <select
          className="filter-dropdown"
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
          data-testid="sortVenues-filter"
          style={{ padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', fontSize: '13px', background: 'var(--surface)' }}
        >
          <option value="highest">{t('highestCapacity')}</option>
          <option value="lowest">{t('lowestCapacity')}</option>
        </select>
      </div>

      <LoadingState isLoading={venueLoading} variant="spinner" size="lg">
        <div
          className="grid-3"
          data-testid="orgvenueslist"
        >
          {venues.length ? (
            venues.map((venueItem: InterfaceQueryVenueListItem) => (
              <div className="venue-card" key={venueItem.node.id}>
                <div className="venue-img">
                  {venueItem.node.image ? (
                    <img
                      src={venueItem.node.image}
                      alt={venueItem.node.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    'Image Placeholder'
                  )}
                </div>
                <div className="venue-info">
                  <div className="venue-name">{venueItem.node.name}</div>
                  <div className="venue-address">
                    {venueItem.node.description ?? ''}
                  </div>
                  <div className="venue-meta">
                    <span className="venue-capacity">
                      {t('capacity')}: <strong>{venueItem.node.capacity ?? 0}</strong>
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      data-testid={`editVenueBtn-${venueItem.node.id}`}
                      onClick={() => showEditVenueModal(venueItem)}
                    >
                      {tCommon('edit')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">{t('noVenues')}</p>
            </div>
          )}
        </div>
      </LoadingState>

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
