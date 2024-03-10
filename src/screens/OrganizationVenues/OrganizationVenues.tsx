// import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationVenues.module.css';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_VENUE_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import OrganizationVenuesList from './OrganizationVenuesList';
import convertToBase64 from 'utils/convertToBase64';

function organizationVenues(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  const { getItem } = useLocalStorage();

  document.title = t('title');
  const [eventmodalisOpen, setEventModalIsOpen] = useState(false);
  const [postPhotoUpdated, setPostPhotoUpdated] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    capacity: '',
    imageURL: '',
  });
  const currentUrl = window.location.href.split('/')[4];

  // console.log(currentUrl);
  const showInviteModal = (): void => {
    setEventModalIsOpen(true);
  };
  const hideInviteModal = (): void => {
    setEventModalIsOpen(false);
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

  // const { data, loading, error, refetch } = useQuery(
  //   ORGANIZATION_EVENT_CONNECTION_LIST,
  //   {
  //     variables: {
  //       organization_id: currentUrl,
  //       title_contains: '',
  //       description_contains: '',
  //       location_contains: '',
  //     },
  //   },
  // );

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const userId = getItem('id') as string;
  const userRole = getItem('UserType') as string;

  const [create, { loading: loading2 }] = useMutation(CREATE_VENUE_MUTATION);

  const createVenue = async (e: any): Promise<void> => {
    e.preventDefault();
    if (formState.name.trim().length > 0) {
      try {
        // console.log('addVenue', currentUrl);

        const { data: addVenue } = await create({
          variables: {
            capacity: parseInt(formState.capacity),
            file: formState.imageURL,
            description: formState.description,
            name: formState.name,
            organizationId: currentUrl,
          },
        });

        // console.log(addVenue);
        // console.log('addVenue');

        /* istanbul ignore next */
        if (addVenue) {
          toast.success(t('venueAdded'));
          hideInviteModal();
          setFormState({
            name: '',
            description: '',
            imageURL: '',
            capacity: '',
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    }
    if (formState.name.trim().length === 0) {
      toast.warning('Venue title can not be blank!');
    }
  };

  return (
    <>
      {/* <div className={styles.mainpageright}>
        <div className={styles.justifysp}>
          <p className={styles.logintitle}>{t('venue')}</p>
          <Button
            variant="success"
            className={styles.addbtn}
            onClick={showInviteModal}
            data-testid="createVenueModalBtn"
          >
            <i className="fa fa-plus"></i> {t('addVenue')}
          </Button>
        </div>
      </div> */}
      <div className={styles.mainpageright}>
        <div className={styles.justifysp}>
          <p className={styles.logintitle}>{t('events')}</p>
          <Button
            variant="success"
            className={styles.addbtn}
            onClick={showInviteModal}
            data-testid="createEventModalBtn"
          >
            <i className="fa fa-plus"></i> {t('addVenue')}
          </Button>
        </div>
      </div>

      <Modal show={eventmodalisOpen} onHide={hideInviteModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
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
            <label htmlFor="eventtitle">{t('eventTitle')}</label>
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
            <label htmlFor="eventdescrip">{t('description')}</label>
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
            <label htmlFor="eventLocation">{t('location')}</label>
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
            <Form.Label htmlFor="postPhoto">{t('image')}</Form.Label>
            <Form.Control
              accept="image/*"
              id="postImageUrl"
              data-testid="postImageUrl"
              name="postphoto"
              type="file"
              placeholder={t('image')}
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
                    imageURL: await convertToBase64(file),
                  });
                }
              }}
            />
            {postPhotoUpdated && (
              <div className={styles.preview}>
                <img src={formState.imageURL} alt="Post Image Preview" />
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

      <OrganizationVenuesList />
    </>
  );
}

export default organizationVenues;
