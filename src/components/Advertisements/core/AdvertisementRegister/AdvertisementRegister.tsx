/**
 * AdvertisementRegister Component
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
import { useParams } from 'react-router';
import type {
  InterfaceAddOnRegisterProps,
  InterfaceFormStateTypes,
} from 'types/Advertisement/interface';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { BaseModal } from 'shared-components/BaseModal';

dayjs.extend(utc);

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

      const variables = {
        organizationId: organizationId,
        name: formState.name,
        type: formState.type,
        startAt: dayjs.utc(formState.startAt).startOf('day').toISOString(),
        endAt: dayjs.utc(formState.endAt).startOf('day').toISOString(),
        description: formState.description,
      };

      const { data } = await createAdvertisement({ variables });

      if (data) {
        NotificationToast.success(t('advertisementCreated') as string);
        handleClose();
        setAfterActive?.(null);
        setAfterCompleted?.(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(
          tErrors('errorOccurredCouldntCreate', { entity: 'advertisement' }),
        );
      }
    }
  };

  const handleUpdate = async (): Promise<void> => {
    try {
      const mutationVariables = {
        id: idEdit,
        name: formState.name,
        description: formState.description,
        type: formState.type,
        startAt: dayjs.utc(formState.startAt).startOf('day').toISOString(),
        endAt: dayjs.utc(formState.endAt).startOf('day').toISOString(),
      };

      const { data } = await updateAdvertisement({
        variables: mutationVariables,
      });

      if (data) {
        NotificationToast.success(
          tCommon('updatedSuccessfully', { item: 'Advertisement' }),
        );
        handleClose();
        setAfterActive?.(null);
        setAfterCompleted?.(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) NotificationToast.error(error.message);
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
          data-cy="createAdvertisementButton"
        >
          <i className="fa fa-plus me-2" />
          {t('createAdvertisement')}
        </Button>
      ) : (
        <Button
          variant="link"
          className="p-0 border-0"
          onClick={handleShow}
          data-testid="editBtn"
          data-cy="editAdvertisementButton"
          aria-label={t('editAdvertisement')}
        >
          {tCommon('edit')}
        </Button>
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
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              data-cy="advertisementNameInput"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.Rdesc">
            <Form.Label>{t('Rdesc')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('EXdesc')}
              value={formState.description || ''}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              data-cy="advertisementDescriptionInput"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.Rtype">
            <Form.Label>{t('Rtype')}</Form.Label>
            <Form.Select
              value={formState.type}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, type: e.target.value }))
              }
              data-cy="advertisementTypeSelect"
            >
              <option value="banner">{t('bannerAd')}</option>
              <option value="pop_up">{t('popupAd')}</option>
              <option value="menu">{t('menuAd')}</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.Rmedia">
            <Form.Label>{t('Rmedia')}</Form.Label>
            <Form.Control
              type="file"
              disabled
              data-cy="advertisementMediaInput"
            />
            <Form.Text className="text-muted">
              {t('mediaUploadsUnavailable')}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.RstartAt">
            <Form.Label>{t('RstartDate')}</Form.Label>
            <Form.Control
              type="date"
              value={dayjs.utc(formState.startAt).format('YYYY-MM-DD')}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  startAt: dayjs.utc(e.target.value).toDate(),
                }))
              }
              data-cy="advertisementStartDateInput"
              data-testid="advertisementStartDateInput"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerForm.RDate">
            <Form.Label>{t('RendDate')}</Form.Label>
            <Form.Control
              type="date"
              value={dayjs.utc(formState.endAt).format('YYYY-MM-DD')}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  endAt: dayjs.utc(e.target.value).toDate(),
                }))
              }
              data-cy="advertisementEndDateInput"
              data-testid="advertisementEndDateInput"
            />
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            data-testid="addonclose"
            data-cy="closeModalButton"
          >
            {tCommon('close')}
          </Button>
          <Button
            onClick={formStatus === 'register' ? handleRegister : handleUpdate}
            className={styles.addButton}
            data-testid={
              formStatus === 'register' ? 'addonregister' : 'addonupdate'
            }
            data-cy={
              formStatus === 'register'
                ? 'registerAdvertisementButton'
                : 'saveChanges'
            }
          >
            {formStatus === 'register'
              ? tCommon('register')
              : tCommon('saveChanges')}
          </Button>
        </div>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
}

export default AdvertisementRegister;
