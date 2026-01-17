/**
 * AdvertisementRegister Component
 *
 * This component handles the creation and editing of advertisements for an organization.
 * It provides a modal-based form to input advertisement details such as name, media, type,
 * start date, and end date. The component supports both "register" and "edit" modes.
 *
 * @component
 * @param {InterfaceAddOnRegisterProps} props - The properties for the component.
 * @param {string} [props.formStatus='register'] - Determines whether the form is in "register" or "edit" mode.
 * @param {string} [props.idEdit] - The ID of the advertisement being edited (used in "edit" mode).
 * @param {string} [props.nameEdit=''] - The name of the advertisement being edited.
 * @param {string} [props.typeEdit='BANNER'] - The type of the advertisement being edited.
 * @param {string} [props.advertisementMediaEdit=''] - The media file of the advertisement being edited.
 * @param {Date} [props.startDateEdit=new Date()] - The start date of the advertisement being edited.
 * @param {Date} [props.endDateEdit=new Date()] - The end date of the advertisement being edited.
 * @param {Function} props.setAfter - Callback to reset pagination or refetch data after mutation.
 *
 * @returns {JSX.Element} The AdvertisementRegister component.
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and form components.
 * - Integrates with Apollo Client for GraphQL mutations and queries.
 * - Validates date ranges to ensure the end date is not earlier than the start date.
 * - Converts uploaded media files to Base64 format for preview and submission.
 *
 * @example
 * <AdvertisementRegister
 *   formStatus="register"
 *   setAfter={setAfterCallback}
 * />
 *
 * @example
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
 */
import React, { useState, useEffect } from 'react';
import styles from 'style/app-fixed.module.css';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';

// Extend dayjs with UTC plugin
dayjs.extend(utc);
import { useParams } from 'react-router';
import type {
  InterfaceAddOnRegisterProps,
  InterfaceFormStateTypes,
} from 'types/Advertisement/interface';
import { FaTrashCan } from 'react-icons/fa6';
import PageNotFound from 'screens/PageNotFound/PageNotFound';

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
    attachments: undefined,
  });

  const handleClose = (): void => {
    setFormState({
      name: '',
      type: 'banner',
      description: null,
      startAt: new Date(),
      endAt: dayjs().add(1, 'day').toDate(),
      attachments: undefined,
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
          toast.error(`Invalid file type: ${file.name}`);
        } else if (file.size > maxFileSize) {
          toast.error(`File too large: ${file.name}`);
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        setFormState((prev) => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...validFiles],
        }));
      }
    }
  };

  // Handle file removal
  const removeFile = (index: number): void => {
    setFormState((prev) => ({
      ...prev,
      attachments: (prev?.attachments || []).filter((_, i) => i !== index),
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
        startAt: startAtEdit || new Date(),
        endAt: endAtEdit || new Date(),
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
        toast.error(t('endDateGreater') as string);
        return;
      }

      if (!formState.name) {
        toast.error('Invalid arguments for this action.');
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
        toast.success(t('advertisementCreated') as string);
        handleClose();
        setFormState({
          name: '',
          type: 'banner',
          description: null,
          startAt: new Date(formState.startAt || new Date()),
          endAt: new Date(),
          organizationId: currentOrg,
          attachments: undefined,
          existingAttachments: undefined,
        });
        setAfterActive(null);
        setAfterCompleted(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
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
          toast.error(t('endDateGreater') as string);
          return;
        }
      }

      const startAt = formState.startAt
        ? dayjs.utc(formState.startAt).startOf('day').toISOString()
        : null;
      const endAt = formState.endAt
        ? dayjs.utc(formState.endAt).startOf('day').toISOString()
        : null;

      const mutationVariables = {
        id: idEdit,
        ...(updatedFields.name && { name: updatedFields.name }),
        ...(updatedFields.attachments && {
          attachments: updatedFields.attachments,
        }),
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
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Advertisement' }) as string,
        );
        handleClose();
        setAfterActive(null);
        setAfterCompleted(null);
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
          <i className="fa fa-plus" />
          &nbsp;
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
                data-cy="advertisementNameInput"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.Rdesc">
              <Form.Label>{t('Rdesc')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('EXdesc')}
                autoComplete="off"
                value={formState.description || ''}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    description: e.target.value,
                  });
                }}
                className={styles.inputField}
                data-cy="advertisementDescriptionInput"
              />
            </Form.Group>
            {formStatus === 'register' && (
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
                  multiple={true}
                  onChange={handleFileUpload}
                  className={styles.inputField}
                  data-cy="advertisementMediaInput"
                />
                {/* Preview section */}
                {(formState.attachments || []).map((file, index) => (
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
                          label="English captions"
                        />
                      </video>
                    ) : (
                      <img
                        data-testid="mediaPreview"
                        src={encodeURI(URL.createObjectURL(file))}
                        alt="Preview"
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
              </Form.Group>
            )}
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
                data-cy="advertisementTypeSelect"
              >
                <option value="banner">Banner Ad </option>
                <option value="pop_up">Popup Ad</option>
                <option value="menu">Menu Ad</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.RstartAt">
              <Form.Label>{t('RstartDate')}</Form.Label>
              <Form.Control
                type="date"
                required
                value={
                  formState.startAt instanceof Date
                    ? dayjs.utc(formState.startAt).format('YYYY-MM-DD')
                    : ''
                }
                onChange={(e): void => {
                  // Create UTC date from date input to avoid timezone issues
                  const newDate = dayjs.utc(e.target.value).toDate();
                  setFormState({
                    ...formState,
                    startAt: newDate,
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
                value={
                  formState.endAt instanceof Date
                    ? dayjs.utc(formState.endAt).format('YYYY-MM-DD')
                    : ''
                }
                onChange={(e): void => {
                  // Create UTC date from date input to avoid timezone issues
                  const newDate = dayjs.utc(e.target.value).toDate();
                  setFormState({
                    ...formState,
                    endAt: newDate,
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
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdvertisementRegister;
