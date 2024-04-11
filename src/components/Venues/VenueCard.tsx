import React from 'react';
import { Card, Button } from 'react-bootstrap';
import defaultImg from 'assets/images/defaultImg.png';
import { ReactComponent as PeopleIcon } from 'assets/svgs/people.svg';
import styles from 'screens/OrganizationVenues/OrganizationVenues.module.css';
import { useTranslation } from 'react-i18next';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';

interface InterfaceVenueCardProps {
  venueItem: InterfaceQueryVenueListItem;
  index: number;
  showEditVenueModal: (venueItem: InterfaceQueryVenueListItem) => void;
  handleDelete: (venueId: string) => void;
}

const VenueCard = ({
  venueItem,
  index,
  showEditVenueModal,
  handleDelete,
}: InterfaceVenueCardProps): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });
  return (
    <div
      className="col-xl-4 col-lg-4 col-md-6"
      data-testid={`venue-item${index + 1}`}
      key={venueItem._id}
    >
      <div className={styles.cards} data-testid="cardStructure">
        <Card className={styles.card}>
          <Card.Img
            variant="top"
            src={venueItem.image || defaultImg}
            alt="image not found"
            className={styles.novenueimage}
          />
          <Card.Body className="pb-0">
            <Card.Title className="d-flex justify-content-between">
              <div className={styles.title}>
                {venueItem.name.length > 25
                  ? venueItem.name.slice(0, 25) + '...'
                  : venueItem.name}
              </div>

              <div className={styles.capacityLabel}>
                Capacity: {venueItem.capacity}
                <PeopleIcon className="ms-1" width={16} height={16} />
              </div>
            </Card.Title>
            <Card.Text className={styles.text}>
              {venueItem.description && venueItem.description.length > 75
                ? venueItem.description.slice(0, 75) + '...'
                : venueItem.description}
            </Card.Text>
          </Card.Body>
          <div className="d-flex justify-content-end gap-2 mb-2 me-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                showEditVenueModal(venueItem);
              }}
              data-testid={`updateVenueBtn${index + 1}`}
            >
              <i className="fa fa-pen me-1"></i>
              <span>{t('edit')}</span>
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              data-testid={`deleteVenueBtn${index + 1}`}
              onClick={() => handleDelete(venueItem._id)}
            >
              <i className="fa fa-trash me-2"></i>
              <span>{t('delete')}</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VenueCard;
