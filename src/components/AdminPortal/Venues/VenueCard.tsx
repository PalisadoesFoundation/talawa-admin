/**
 * VenueCard Component
 *
 * This component renders a card for displaying venue details, including
 * its image, name, capacity, and description. It also provides options
 * to edit or delete the venue.
 *
 * @param venueItem - The venue item containing details such as name, image, capacity, and description.
 * @param index - The index of the venue item in the list, used for unique test IDs.
 * @param showEditVenueModal - Callback function to trigger the edit modal for the venue.
 * @param handleDelete - Callback function to handle the deletion of the venue by its ID.
 *
 * @returns A JSX element representing the venue card.
 *
 * @remarks
 * - The component uses Bootstrap for styling and layout.
 * - The `useTranslation` hook is used for internationalization of button labels.
 * - Truncates long venue names and descriptions for better UI presentation.
 *
 * @example
 * ```tsx
 * <VenueCard
 *   venueItem={venue}
 *   index={0}
 *   showEditVenueModal={handleEdit}
 *   handleDelete={handleDelete}
 * />
 * ```
 *
 */
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImg from 'assets/images/defaultImg.png';
import PeopleIcon from 'assets/svgs/people.svg?react';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';

interface InterfaceVenueCardProps {
  venueItem: InterfaceQueryVenueListItem;
  showEditVenueModal: (venueItem: InterfaceQueryVenueListItem) => void;
  handleDelete: (venueId: string) => void;
}

const VenueCard = ({
  venueItem,
  showEditVenueModal,
  handleDelete,
}: InterfaceVenueCardProps): JSX.Element => {
  // Translation hook for internationalization
  const { t: tCommon } = useTranslation('common');
  return (
    <div
      className="col-xl-4 col-lg-4 col-md-6"
      data-testid={`venue-item-${venueItem.node.id}`}
      key={venueItem.node.id}
    >
      <div className={styles.cards} data-testid="cardStructure">
        <Card className={styles.card}>
          {/* Venue image or default image if none provided */}
          <Card.Img
            variant="top"
            src={venueItem.node.attachments?.[0]?.url || defaultImg}
            alt={tCommon('imageNotFound')}
            className={styles.venueimage}
            crossOrigin="anonymous"
          />
          <Card.Body className="pb-0">
            <Card.Title className="d-flex justify-content-between">
              {/* Venue name with truncation if too long */}
              <div className={styles.title}>
                {venueItem.node.name.length > 25
                  ? venueItem.node.name.slice(0, 25) + '...'
                  : venueItem.node.name}
              </div>

              {/* Venue capacity with icon */}
              {venueItem.node.capacity != null && (
                <div className={styles.capacityLabel}>
                  {tCommon('capacity')}: {venueItem.node.capacity}
                  <PeopleIcon className="ms-1" width={16} height={16} />
                </div>
              )}
            </Card.Title>
            <Card.Text className={styles.text}>
              {/* Venue description with truncation if too long */}
              {venueItem.node.description &&
              venueItem.node.description.length > 40
                ? venueItem.node.description.slice(0, 40) + '...'
                : venueItem.node.description}
            </Card.Text>
          </Card.Body>
          <div className="d-flex justify-content-end gap-2 mb-2 me-3">
            {/* Edit button */}
            <Button
              size="sm"
              onClick={() => {
                showEditVenueModal(venueItem);
              }}
              data-testid={`updateVenueBtn-${venueItem.node.id}`}
              className={`btn ${styles.addButton}`}
            >
              <i className="fa fa-pen me-1"></i>
              <span>{tCommon('edit')}</span>
            </Button>
            {/* Delete button */}
            <Button
              size="sm"
              data-testid={`deleteVenueBtn-${venueItem.node.id}`}
              onClick={() => handleDelete(venueItem.node.id)}
              className={`btn btn-danger ${styles.removeButton}`}
            >
              <i className="fa fa-trash me-2"></i>
              <span>{tCommon('delete')}</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VenueCard;
