import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../../style/app-fixed.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { useParams } from 'react-router-dom';
import type {
  InterfaceAddOnRegisterProps,
  InterfaceFormStateTypes,
} from 'types/Advertisement/interface';
/**
 * Props for the `advertisementRegister` component.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.dropdown`
 * - `.inputField`
 * - `.removeButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

/**
 * Component for registering or editing an advertisement.
 *
 * @param props - Contains form status, advertisement details, and a function to update parent state.
 * @returns A JSX element that renders a form inside a modal for creating or editing an advertisement.
 *
 * @example
 * ```tsx
 * <AdvertisementRegister
 *   formStatus="register"
 *   setAfter={(value) => console.log(value)}
 * />
 * ```
 */
function advertisementRegister({
  formStatus = 'register',
  idEdit,
  nameEdit = '',
  typeEdit = 'banner',
  attachmentEdit = '',
  endAtEdit = new Date(),
  startAtEdit = new Date(),
  setAfter,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId: currentOrg } = useParams();

  const [show, setShow] = useState(false);
  const handleClose = (): void => setShow(false); // Closes the modal
  const handleShow = (): void => setShow(true); // Shows the modal

  const [createAdvertisement] = useMutation(ADD_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          input: {
            id: currentOrg,
          },
          first: 12,
          after: null,
          before: null,
        },
      },
    ],
  });

  const [updateAdvertisement] = useMutation(UPDATE_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          input: {
            id: currentOrg,
          },
          first: 12,
          after: null,
        },
      },
    ],
  });

  // Set Initial Form State While Creating an Advertisemnt
  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    name: '',
    type: 'banner',
    startAt: new Date(),
    endAt: new Date(),
    organizationId: currentOrg,
    attachments: [],
    // attachments: attachmentEdit,
  });
  // Handle file uploads
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    try {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);
        setFormState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...newFiles],
        }));
      }
    } catch (e) {
      console.error('Error during File Upload:', e);
    }
  };
  // Handle file removal
  const removeFile = (index: number): void => {
    setFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Set form state if editing
  useEffect(() => {
    if (formStatus === 'edit') {
      setFormState((prevState) => ({
        ...prevState,
        name: nameEdit || '',
        advertisementMedia: attachmentEdit || '',
        type: typeEdit || 'banner',
        startAt: startAtEdit || new Date(),
        endAt: endAtEdit || new Date(),
        orgId: currentOrg,
      }));
    }
  }, [
    formStatus,
    nameEdit,
    attachmentEdit,
    typeEdit,
    startAtEdit,
    endAtEdit,
    currentOrg,
  ]);
  /**
   * Handles advertisement registration.
   * Validates the date range and performs the mutation to create an advertisement.
   */
  const handleRegister = async (): Promise<void> => {
    const formData = new FormData();

    formState.attachments.forEach((file) =>
      formData.append('attachments', file),
    );
    try {
      if (formState.endAt < formState.startAt) {
        toast.error(t('endAtGreaterOrEqual') as string);
        return;
      }
      const { data } = await createAdvertisement({
        variables: {
          organizationId: currentOrg,
          name: formState.name as string,
          type: formState.type as string,
          startAt: dayjs(formState.startAt).toISOString(),
          endAt: dayjs(formState.endAt).toISOString(),
          attachments: formState.attachments,
        },
      });
      if (data) {
        toast.success(t('advertisementCreated') as string);
        handleClose();
        // Reset form state if necessary
        setFormState({
          name: '',
          type: 'banner',
          startAt: new Date(),
          endAt: new Date(),
          organizationId: currentOrg,
          attachments: [],
        });
      }
      setAfter(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          tErrors('errorOccurredCouldntCreate', {
            entity: 'advertisement',
          }) as string,
        );
        console.error('Error occurred', error.message);
      }
    }
  };

  /**
   * Handles advertisement update.
   * Validates the date range and performs the mutation to update the advertisement.
   */
  const handleUpdate = async (): Promise<void> => {
    try {
      const updatedFields: Partial<InterfaceFormStateTypes> = {};

      // Only include the fields which are updated
      if (formState.name !== nameEdit) {
        updatedFields.name = formState.name;
      }
      if (formState.attachments !== updatedFields.attachments) {
        updatedFields.attachments = formState.attachments; //updated field me new file aa to rha hai
      }
      if (formState.type !== typeEdit) {
        updatedFields.type = formState.type;
      }
      if (formState.endAt < formState.startAt) {
        toast.error(t('endAtGreaterOrEqual') as string);
        return;
      }
      const startAtFormattedString = dayjs(formState.startAt).toISOString();
      const endAtFormattedString = dayjs(formState.endAt).toISOString();

      const startAtDate = dayjs(startAtFormattedString, 'YYYY-MM-DD').toDate();
      const endAtDate = dayjs(endAtFormattedString, 'YYYY-MM-DD').toDate();

      if (!dayjs(endAtDate).isSame(endAtEdit, 'day')) {
        updatedFields.endAt = endAtDate;
      }
      if (!dayjs(startAtDate).isSame(startAtEdit, 'day')) {
        updatedFields.startAt = startAtDate;
      }
      const mutationVariables = {
        id: idEdit,
        ...(updatedFields.name && { name: updatedFields.name }),
        ...(updatedFields.attachments && {
          attachments: updatedFields.attachments,
        }),
        ...(updatedFields.type && { type: updatedFields.type }),
        startAt: startAtFormattedString,
        endAt: endAtFormattedString,
      };
      //query to update the advertisement.
      const { data } = await updateAdvertisement({
        variables: mutationVariables,
      });

      if (data) {
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Advertisement' }) as string,
        );
        handleClose();
        setAfter(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    //If register show register button else show edit button
    <>
      {formStatus === 'register' ? (
        <Button
          className={styles.dropdown}
          variant="primary"
          onClick={handleShow}
          data-testid="createAdvertisement"
        >
          <i className="fa fa-plus"></i>
          {t('createAdvertisement')}
        </Button>
      ) : (
        <div onClick={handleShow} data-testid="editBtn">
          {tCommon('edit')}
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {formStatus === 'register' ? (
            <Modal.Title> {t('addNew')}</Modal.Title>
          ) : (
            <Modal.Title>{t('editAdvertisement')}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>{t('Rname')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('EXname')}
                autoComplete="off"
                required
                value={formState.name}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  });
                }}
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="advertisementMedia">
                {t('Rmedia')}
              </Form.Label>
              <Form.Control
                accept="image/*, video/*"
                data-testid="advertisementMedia"
                name="advertisementMedia"
                type="file"
                id="advertisementMedia"
                multiple={false}
                onChange={handleFileUpload}
                className={styles.inputField}
              />
              {/* Preview section */}
              {formState.existingAttachments && (
                <div
                  className={styles.previewAdvertisementRegister}
                  data-testid="mediaPreview"
                >
                  {formState.existingAttachments.includes('video') ? (
                    <video
                      muted
                      autoPlay={true}
                      loop={true}
                      playsInline
                      crossOrigin="anonymous"
                      src={formState.existingAttachments}
                    />
                  ) : (
                    <img
                      src={formState.existingAttachments}
                      alt="Existing Attachment"
                    />
                  )}
                </div>
              )}
              {formState.attachments.map((file, index) => (
                <div key={index}>
                  {file?.type?.startsWith?.('video/') ? (
                    <video
                      data-testid="mediaPreview"
                      controls
                      src={URL.createObjectURL(file)}
                    />
                  ) : (
                    <img
                      data-testid="mediaPreview"
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                    />
                  )}
                  <button
                    className={styles.closeButtonAdvertisementRegister}
                    onClick={() => removeFile(index)}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              ))}
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.Rtype">
              <Form.Label>{t('Rtype')}</Form.Label>
              <Form.Select
                aria-label={t('Rtype')}
                value={formState.type}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    type: e.target.value,
                  });
                }}
                className={styles.inputField}
              >
                <option value="banner">Banner Ad </option>
                <option value="pop_up">Popup Ad</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.RstartAt">
              <Form.Label>{t('RstartDate')}</Form.Label>
              <Form.Control
                type="date"
                required
                value={formState.startAt.toISOString().slice(0, 10)}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    startAt: new Date(e.target.value),
                  });
                }}
                className={styles.inputField}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.RDate">
              <Form.Label>{t('RendDate')}</Form.Label>
              <Form.Control
                type="date"
                required
                value={formState.endAt.toISOString().slice(0, 10)}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    endAt: new Date(e.target.value),
                  });
                }}
                className={styles.inputField}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className={`btn btn-danger ${styles.removeButton}`}
            data-testid="addonclose"
          >
            {tCommon('close')}
          </Button>
          {formStatus === 'register' ? (
            <Button
              onClick={handleRegister}
              data-testid="addonregister"
              className={styles.addButton}
            >
              {tCommon('register')}
            </Button>
          ) : (
            <Button
              onClick={handleUpdate}
              data-testid="addonupdate"
              className={styles.addButton}
            >
              {tCommon('saveChanges')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

advertisementRegister.propTypes = {
  name: PropTypes.string,
  advertisementMedia: PropTypes.string,
  type: PropTypes.string,
  startAt: PropTypes.instanceOf(Date),
  endAt: PropTypes.instanceOf(Date),
  organizationId: PropTypes.string,
  formStatus: PropTypes.string,
};

export default advertisementRegister;
