import React from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImg from 'assets/images/defaultImg.png';
import PeopleIcon from 'assets/svgs/people.svg?react';
import styles from '../../style/app.module.css';
import { useTranslation } from 'react-i18next';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';

interface InterfaceVenueCardProps {
  venueItem: InterfaceQueryVenueListItem;
  index: number;
  showEditVenueModal: (venueItem: InterfaceQueryVenueListItem) => void;
  handleDelete: (venueId: string) => void;
}

/**
 * Represents a card component displaying venue information.
 *
 * This component renders a card with the venue's image, name, capacity, and description.
 * It also provides buttons to edit or delete the venue.
 *
 * @param venueItem - The venue item to be displayed in the card.
 * @param index - The index of the venue item in the list, used for test IDs.
 * @param showEditVenueModal - Function to show the edit venue modal, passing the current venue item.
 * @param handleDelete - Function to handle the deletion of the venue, passing the venue ID.
 *
 * @returns JSX.Element - The `VenueCard` component.
 *
 * @example
 * ```tsx
 * <VenueCard
 *   venueItem={venue}
 *   index={0}
 *   showEditVenueModal={handleShowEditVenueModal}
 *   handleDelete={handleDeleteVenue}
 * />
 * ```
 */
const VenueCard = ({
  venueItem,
  index,
  showEditVenueModal,
  handleDelete,
}: InterfaceVenueCardProps): JSX.Element => {
  // Translation hook for internationalization
  const { t: tCommon } = useTranslation('common');

  return (
    <div
      className="col-xl-4 col-lg-4 col-md-6"
      data-testid={`venue-item${index + 1}`}
      key={venueItem._id}
    >
      <div className={styles.cards} data-testid="cardStructure">
        <Card className={styles.card}>
          {/* Venue image or default image if none provided */}
          <Card.Img
            variant="top"
            src={venueItem.image || defaultImg}
            alt="image not found"
            className={styles.novenueimage}
          />
          <Card.Body className="pb-0">
            <Card.Title className="d-flex justify-content-between">
              {/* Venue name with truncation if too long */}
              <div className={styles.title}>
                {venueItem.name.length > 25
                  ? venueItem.name.slice(0, 25) + '...'
                  : venueItem.name}
              </div>

              {/* Venue capacity with icon */}
              <div className={styles.capacityLabel}>
                Capacity: {venueItem.capacity}
                <PeopleIcon className="ms-1" width={16} height={16} />
              </div>
            </Card.Title>
            <Card.Text className={styles.text}>
              {/* Venue description with truncation if too long */}
              {venueItem.description && venueItem.description.length > 75
                ? venueItem.description.slice(0, 75) + '...'
                : venueItem.description}
            </Card.Text>
          </Card.Body>
          <div className="d-flex justify-content-end gap-2 mb-2 me-3">
            {/* Edit button */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                showEditVenueModal(venueItem);
              }}
              data-testid={`updateVenueBtn${index + 1}`}
            >
              <i className="fa fa-pen me-1"></i>
              <span>{tCommon('edit')}</span>
            </Button>
            {/* Delete button */}
            <Button
              variant="outline-danger"
              size="sm"
              data-testid={`deleteVenueBtn${index + 1}`}
              onClick={() => handleDelete(venueItem._id)}
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
