/**
 * AdvertisementRegister Component
 *
 * Handles the creation and editing of advertisements.
 *
 * @param props - The properties for the component.
 * @returns The AdvertisementRegister component.
 *
 * @remarks
 * - Media upload is temporarily disabled to align with Apollo HttpLink standardization.
 * - End date validation ensures the range is logical.
 */
import React, { useState, useEffect } from 'react';
import styles from 'style/app-fixed.module.css';
import { Button, Form } from 'react-bootstrap';
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

dayjs.extend(utc);
import { useParams } from 'react-router';
import type {
  InterfaceAddOnRegisterProps,
  InterfaceFormStateTypes,
} from 'types/Advertisement/interface';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { BaseModal } from 'shared-components/BaseModal';

/**
 * Type guard to ensure the organization ID is a valid string.
 * @param id - The ID to validate.
 * @returns True if the ID is a string.
 */
const isValidOrg = (id: unknown): id is string => typeof id === 'string';

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

  // Narrow the ID early for use in hooks and component logic
  if (!isValidOrg(currentOrg)) {
    return <PageNotFound />;
  }

  const organizationId = currentOrg;

  const [createAdvertisement] = useMutation(ADD_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: organizationId,
          first: 6,
          after: null,
          before: null,
          where: { isCompleted: false },
        },
      },
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: {
          id: organizationId,
          first: 6,
          after: null,
          before: null,
          where: { isCompleted: true },
        },
      },
    ],
  });

  const [updateAdvertisement] = useMutation(UPDATE_ADVERTISEMENT_MUTATION);

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

  const handleShow = (): void => setShow(true);

  useEffect(() => {
    if (formStatus === 'edit') {
      setFormState((prevState) => ({
        ...prevState,
        name: nameEdit || '',
        description: descriptionEdit || null,
        type: typeEdit || 'banner',
        startAt: startAtEdit,
        endAt: endAtEdit,
        organizationId: organizationId,
      }));
    }
  }, [
    formStatus,
    nameEdit,
    descriptionEdit,
    typeEdit,
    startAtEdit,
    endAtEdit,
    organizationId,
  ]);

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
        description?: string | null;
      } = {
        organizationId: organizationId,
        name: formState.name as string,
        type: formState.type as string,
        startAt: dayjs.utc(formState.startAt).startOf('day').toISOString(),
        endAt: dayjs.utc(formState.endAt).startOf('day').toISOString(),
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

  const handleUpdate = async (): Promise<void> => {
    try {
      const updatedFields: Partial<InterfaceFormStateTypes> = {};

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

  return (
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
        headerContent={
          <div data-testid="advertisementModalHeader">
            {formStatus === 'register' ? t('addNew') : t('editAdvertisement')}
          </div>
        }
      >
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
                setFormState((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
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
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              className={styles.inputField}
              data-cy="advertisementDescriptionInput"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.Rtype">
            <Form.Label>{t('Rtype')}</Form.Label>
            <Form.Select
              aria-label={t('Rtype')}
              value={formState.type}
              onChange={(e): void => {
                setFormState((prev) => ({
                  ...prev,
                  type: e.target.value,
                }));
              }}
              className={styles.inputField}
              data-cy="advertisementTypeSelect"
            >
              <option value="banner">{t('bannerAd')} </option>
              <option value="pop_up">{t('popupAd')}</option>
              <option value="menu">{t('menuAd')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerForm.RstartAt">
            <Form.Label>{t('RstartDate')}</Form.Label>
            <Form.Control
              type="date"
              required
              value={dayjs.utc(formState.startAt).format('YYYY-MM-DD')}
              onChange={(e): void => {
                const newDate = dayjs.utc(e.target.value).toDate();
                setFormState((prev) => ({
                  ...prev,
                  startAt: newDate,
                }));
              }}
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.RDate">
            <Form.Label>{t('RendDate')}</Form.Label>
            <Form.Control
              type="date"
              required
              value={dayjs.utc(formState.endAt).format('YYYY-MM-DD')}
              onChange={(e): void => {
                const newDate = dayjs.utc(e.target.value).toDate();
                setFormState((prev) => ({
                  ...prev,
                  endAt: newDate,
                }));
              }}
              className={styles.inputField}
            />
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-end gap-2 mt-4">
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
        </div>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
}

export default AdvertisementRegister;
