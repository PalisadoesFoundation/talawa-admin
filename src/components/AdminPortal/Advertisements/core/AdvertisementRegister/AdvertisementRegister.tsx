/**
 * AdvertisementRegister Component
 *
 * This component handles the creation and editing of advertisements for an organization.
 * It provides a modal-based form to input advertisement details such as name, media, type,
 * start date, and end date. The component supports both "register" and "edit" modes.
 *
 * @param props - The properties for the component.
 * @param formStatus - Determines whether the form is in "register" or "edit" mode.
 * @param idEdit - The ID of the advertisement being edited (used in "edit" mode).
 * @param nameEdit - The name of the advertisement being edited.
 * @param typeEdit - The type of the advertisement being edited.
 * @param advertisementMediaEdit - The media file of the advertisement being edited.
 * @param startDateEdit - The start date of the advertisement being edited.
 * @param endDateEdit - The end date of the advertisement being edited.
 * @param setAfter - Callback to reset pagination or refetch data after mutation.
 *
 * @returns The AdvertisementRegister component.
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and form components.
 * - Integrates with Apollo Client for GraphQL mutations and queries.
 * - Validates date ranges to ensure the end date is not earlier than the start date.
 * - Converts uploaded media files to Base64 format for preview and submission.
 *
 * @example
 * ```tsx
 * <AdvertisementRegister
 *   formStatus="register"
 *   setAfter={setAfterCallback}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AdvertisementRegister
 *   formStatus="edit"
 *   idEdit="123"
 *   nameEdit="Sample Ad"
 *   typeEdit="POPUP"
 *   advertisementMediaEdit="base64string"
 *   startDateEdit={new Date()}
 *   endDateEdit={new Date()}
 *   setAfter={setAfterCallback}
 * />
 * ```
 */
import React, { useState, useEffect } from 'react';
import styles from './AdvertisementRegister.module.css';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import Button from 'shared-components/Button';
// Extend dayjs with UTC plugin
dayjs.extend(utc);
import { useParams } from 'react-router';
import type {
  InterfaceAddOnRegisterProps,
  InterfaceFormStateTypes,
} from 'types/AdminPortal/Advertisement/interface';
import { FaTrashCan } from 'react-icons/fa6';
import PageNotFound from 'screens/Public/PageNotFound/PageNotFound';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { BaseModal } from 'shared-components/BaseModal';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

function AdvertisementRegister({
  formStatus = 'register',
  idEdit,
  nameEdit = '',
  typeEdit = 'banner',
  descriptionEdit = null,
  endAtEdit = new Date(new Date().setDate(new Date().getDate() + 1)),
  startAtEdit = new Date(),
  setAfterActive,
  setAfterCompleted,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId: currentOrg } = useParams();
  const [show, setShow] = useState(false);

  if (currentOrg === undefined) {
    return <PageNotFound />;
  }
  /*
   * Mutation to add advertisement and refetch the advertisement list
   */
  const [createAdvertisement] = useMutation(ADD_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: currentOrg,
          first: 6,
          after: null,
          before: null,
          where: { isCompleted: false },
        },
      },
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: currentOrg,
          first: 6,
          after: null,
          before: null,
          where: { isCompleted: true },
        },
      },
    ],
  });

  /*
   * Mutation to update advertisement and refetch the advertisement list
   */
  const [updateAdvertisement] = useMutation(UPDATE_ADVERTISEMENT_MUTATION);

  // Set Initial Form State While Creating an Advertisemnt
  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    name: '',
    description: null,
    type: 'banner',
    startAt: new Date(),
    endAt: dayjs().add(1, 'day').toDate(),
    attachments: [],
  });

  const handleClose = (): void => {
    setFormState({
      name: '',
      type: 'banner',
      description: null,
      startAt: new Date(),
      endAt: dayjs().add(1, 'day').toDate(),
      attachments: [],
    });
    setShow(false);
  };

  const handleShow = (): void => setShow(true); // Shows the modal

  // Handle file uploads
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles: File[] = [];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];

      Array.from(files).forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          NotificationToast.error(
            t('invalidFileType', { fileName: file.name }),
          );
        } else if (file.size > maxFileSize) {
          NotificationToast.error(t('fileTooLarge', { fileName: file.name }));
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        setFormState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...validFiles],
        }));
      }
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
        description: descriptionEdit || null,
        type: typeEdit || 'banner',
        startAt: startAtEdit,
        endAt: endAtEdit,
        organizationId: currentOrg,
      }));
    }
  }, [
    formStatus,
    nameEdit,
    descriptionEdit,
    typeEdit,
    startAtEdit,
    endAtEdit,
    currentOrg,
  ]);

  // Validates the date range and performs the mutation to create an advertisement.
  const handleRegister = async (): Promise<void> => {
    try {
      const startDate = dayjs(formState.startAt).startOf('day');
      const endDate = dayjs(formState.endAt).startOf('day');

      if (!endDate.isAfter(startDate)) {
        NotificationToast.error(t('endDateGreater') as string);
        return;
      }

      if (!formState.name) {
        NotificationToast.error(t('invalidArgumentsForAction'));
        return;
      }

      let variables: {
        organizationId: string;
        name: string;
        type: string;
        startAt: string;
        endAt: string;
        attachments: File[] | undefined;
        description?: string | null;
      } = {
        organizationId: currentOrg,
        name: formState.name as string,
        type: formState.type as string,
        startAt: dayjs.utc(formState.startAt).startOf('day').toISOString(),
        endAt: dayjs.utc(formState.endAt).startOf('day').toISOString(),
        attachments: formState.attachments,
      };

      if (formState.description !== null) {
        variables = {
          ...variables,
          description: formState.description,
        };
      }

      const { data } = await createAdvertisement({
        variables,
      });
      if (data) {
        NotificationToast.success(t('advertisementCreated') as string);
        handleClose();
        setFormState({
          name: '',
          type: 'banner',
          description: null,
          startAt: new Date(formState.startAt),
          endAt: new Date(),
          organizationId: currentOrg,
          attachments: [],
          existingAttachments: undefined,
        });
        setAfterActive(null);
        setAfterCompleted(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(
          tErrors('errorOccurredCouldntCreate', {
            entity: 'advertisement',
          }) as string,
        );
      }
    }
  };

  // Handles advertisement update.
  const handleUpdate = async (): Promise<void> => {
    try {
      const updatedFields: Partial<InterfaceFormStateTypes> = {};

      // Only include the fields which are updated
      if (formState.name !== nameEdit) {
        updatedFields.name = formState.name;
      }
      if (formState.type !== typeEdit) {
        updatedFields.type = formState.type;
      }
      if (formState.description !== descriptionEdit) {
        updatedFields.description = formState.description;
      }
      if (formState.startAt !== startAtEdit) {
        updatedFields.startAt = formState.startAt;
      }
      if (formState.endAt !== endAtEdit) {
        updatedFields.endAt = formState.endAt;
      }

      // if both are updated, check if end date is greater or not
      if (updatedFields.endAt && updatedFields.startAt) {
        const startDate = dayjs(updatedFields.startAt).startOf('day');
        const endDate = dayjs(updatedFields.endAt).startOf('day');

        if (!endDate.isAfter(startDate)) {
          NotificationToast.error(t('endDateGreater') as string);
          return;
        }
      }

      const startAt = dayjs.utc(formState.startAt).startOf('day').toISOString();
      const endAt = dayjs.utc(formState.endAt).startOf('day').toISOString();

      const mutationVariables = {
        id: idEdit,
        ...(updatedFields.name && { name: updatedFields.name }),
        ...(updatedFields.description && {
          description: updatedFields.description,
        }),
        ...(updatedFields.type && { type: updatedFields.type }),
        ...(startAt && { startAt }),
        ...(endAt && { endAt }),
      };

      // query to update the advertisement.
      const { data } = await updateAdvertisement({
        variables: mutationVariables,
      });

      if (data) {
        NotificationToast.success(
          tCommon('updatedSuccessfully', { item: 'Advertisement' }) as string,
        );
        handleClose();
        setAfterActive(null);
        setAfterCompleted(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const modalFooter = (
    <>
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
          data-cy="registerAdvertisementButton"
        >
          {tCommon('register')}
        </Button>
      ) : (
        <Button
          onClick={handleUpdate}
          data-testid="addonupdate"
          className={styles.addButton}
          data-cy="saveChanges"
        >
          {tCommon('saveChanges')}
        </Button>
      )}
    </>
  );

  const modalTitle =
    formStatus === 'register' ? t('addNew') : t('editAdvertisement');

  return (
    //If register show register button else show edit button
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={handleClose}
    >
      {formStatus === 'register' ? (
        <Button
          className={styles.dropdown}
          variant="primary"
          onClick={handleShow}
          data-testid="createAdvertisement"
        >
          <i className="fa fa-plus" />
          &nbsp;
          {t('createAdvertisement')}
        </Button>
      ) : (
        <div onClick={handleShow} data-testid="editBtn">
          {tCommon('edit')}
        </div>
      )}
      <BaseModal
        show={show}
        onHide={handleClose}
        title={modalTitle}
        footer={modalFooter}
        dataTestId="advertisementModal"
      >
        <div>
          <FormFieldGroup name="name" label={t('Rname')} required>
            <input
              className={styles.inputField}
              type="text"
              id="name"
              placeholder={t('EXname')}
              autoComplete="off"
              required
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              data-cy="advertisementNameInput"
              data-testid="advertisementNameInput"
            />
          </FormFieldGroup>
          <FormFieldGroup name="description" label={t('Rdesc')}>
            <input
              className={styles.inputField}
              id="description"
              type="text"
              placeholder={t('EXdesc')}
              autoComplete="off"
              value={formState.description || ''}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
              data-cy="advertisementDescriptionInput"
              data-testid="advertisementDescriptionInput"
            />
          </FormFieldGroup>
          {formStatus === 'register' && (
            <FormFieldGroup name="advertisementMedia" label={t('Rmedia')}>
              <input
                className={styles.inputField}
                id="advertisementMedia"
                accept="image/*, video/*"
                name="advertisementMedia"
                type="file"
                multiple
                onChange={handleFileUpload}
                data-cy="advertisementMediaInput"
                data-testid="advertisementMedia"
              />
              {/* Preview section */}
              {formState.attachments.map((file, index) => (
                <div key={index}>
                  {file.type.startsWith('video/') ? (
                    <video
                      data-testid="mediaPreview"
                      controls
                      src={encodeURI(URL.createObjectURL(file))}
                      className={styles.previewAdvertisementRegister}
                    >
                      <track
                        kind="captions"
                        srcLang="en"
                        label={t('englishCaptions')}
                      />
                    </video>
                  ) : (
                    <img
                      data-testid="mediaPreview"
                      src={encodeURI(URL.createObjectURL(file))}
                      alt={t('preview')}
                      className={styles.previewAdvertisementRegister}
                    />
                  )}
                  <Button
                    variant="danger"
                    data-testid="closePreview"
                    className={styles.removeButton}
                    onClick={() => removeFile(index)}
                  >
                    <FaTrashCan />
                  </Button>
                </div>
              ))}
            </FormFieldGroup>
          )}
          <FormFieldGroup name="type" label={t('Rtype')} required>
            <select
              className={styles.inputField}
              id="type"
              aria-label={t('Rtype')}
              value={formState.type}
              onChange={(e) =>
                setFormState({ ...formState, type: e.target.value })
              }
              data-cy="advertisementTypeSelect"
              data-testid="advertisementTypeSelect"
            >
              <option value="banner">{t('bannerAd')}</option>
              <option value="pop_up">{t('popupAd')}</option>
              <option value="menu">{t('menuAd')}</option>
            </select>
          </FormFieldGroup>

          <FormFieldGroup name="startAt" label={t('RstartDate')} required>
            <input
              className={styles.inputField}
              type="date"
              id="startAt"
              required
              value={dayjs.utc(formState.startAt).format('YYYY-MM-DD')}
              onChange={(e) => {
                const newDate = dayjs.utc(e.target.value).toDate();
                setFormState({ ...formState, startAt: newDate });
              }}
              data-testid="advertisementStartDate"
            />
          </FormFieldGroup>
          <FormFieldGroup name="endAt" label={t('RendDate')} required>
            <input
              className={styles.inputField}
              type="date"
              id="endAt"
              required
              value={dayjs.utc(formState.endAt).format('YYYY-MM-DD')}
              onChange={(e) => {
                const newDate = dayjs.utc(e.target.value).toDate();
                setFormState({ ...formState, endAt: newDate });
              }}
              data-testid="advertisementEndDate"
            />
          </FormFieldGroup>
        </div>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
}

export default AdvertisementRegister;
