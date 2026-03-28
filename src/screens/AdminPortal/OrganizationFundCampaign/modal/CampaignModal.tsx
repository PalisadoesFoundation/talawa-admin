import DatePicker from 'shared-components/DatePicker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import CreateIcon from '@mui/icons-material/Create';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button } from 'shared-components/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { currencyOptions, currencySymbols } from 'utils/currency';
import styles from './CampaignModal.module.css';

import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_CAMPAIGN_MUTATION,
  DELETE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import {
  FormTextField,
  FormSelectField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import type { IDateRangeValue, InterfaceCampaignModal } from './types';

export type { InterfaceCampaignModal };

/**
 * Modal component for creating or editing a Fund Campaign.
 *
 * @param isOpen - Whether the modal is open
 * @param hide - Function to hide the modal
 * @param fundId - Fund ID associated with the campaign
 * @param orgId - Organization ID
 * @param campaign - Existing campaign data or null
 * @param refetchCampaign - Callback to refresh campaign list
 * @param mode - 'create' or 'edit'
 * @returns The rendered Fund Campaign modal component
 */

const CampaignModal: React.FC<InterfaceCampaignModal> = ({
  isOpen,
  hide,
  fundId,
  refetchCampaign,
  mode,
  campaign,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });
  const { t: tCommon } = useTranslation('common');

  const normalizeGoalAmount = (value: unknown): number => {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }

    return Math.trunc(parsed);
  };

  const [formState, setFormState] = useState({
    campaignName: campaign?.name ?? '',
    campaignCurrency: campaign?.currencyCode ?? 'USD',
    campaignGoal: normalizeGoalAmount(campaign?.goalAmount),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [campaignDateRange, setCampaignDateRange] = useState<IDateRangeValue>({
    startDate: campaign?.startAt ?? null,
    endDate: campaign?.endAt ?? null,
  });

  const [touched, setTouched] = useState<{ campaignName: boolean }>({
    campaignName: false,
  });

  useEffect(() => {
    setFormState({
      campaignCurrency: campaign?.currencyCode ?? 'USD',
      campaignGoal: normalizeGoalAmount(campaign?.goalAmount),
      campaignName: campaign?.name ?? '',
    });

    setCampaignDateRange({
      startDate: campaign?.startAt ?? null,
      endDate: campaign?.endAt ?? null,
    });
    setTouched({ campaignName: false });
  }, [campaign]);

  const { campaignName, campaignCurrency, campaignGoal } = formState;

  const [createCampaign] = useMutation(CREATE_CAMPAIGN_MUTATION);
  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN_MUTATION);
  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN_MUTATION);

  const isEditMode = mode === 'edit';

  const isNameInvalid = touched.campaignName && !campaignName.trim();

  const createCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!campaignName.trim()) {
      NotificationToast.error(t('campaignNameRequired') as string);
      setTouched((prev) => ({ ...prev, campaignName: true }));
      return;
    }

    // 1. Check for Missing Dates
    if (!campaignDateRange.startDate || !campaignDateRange.endDate) {
      NotificationToast.error(t('dateRangeRequired') as string);
      return;
    }

    // 2. Check for Invalid Dates (e.g. manually typed "INVALID_DATE")
    // dayjs objects created from "Invalid Date" are invalid.
    if (
      !dayjs(campaignDateRange.startDate).isValid() ||
      !dayjs(campaignDateRange.endDate).isValid()
    ) {
      NotificationToast.error(t('invalidDate') as string);
      return;
    }

    // 3. Check for Date Order (Start > End)
    if (
      dayjs(campaignDateRange.startDate).isAfter(
        dayjs(campaignDateRange.endDate),
      )
    ) {
      NotificationToast.error(t('endDateBeforeStart') as string);
      return;
    }

    try {
      setIsSubmitting(true);
      await createCampaign({
        variables: {
          name: campaignName.trim(),
          currencyCode: campaignCurrency,
          goalAmount: normalizeGoalAmount(campaignGoal),
          startAt: dayjs(campaignDateRange.startDate).toISOString(),
          endAt: dayjs(campaignDateRange.endDate).toISOString(),
          fundId,
        },
      });
      NotificationToast.success(t('createdCampaign') as string);
      setFormState({
        campaignName: '',
        campaignCurrency: 'USD',
        campaignGoal: 0,
      });
      setTouched({ campaignName: false });
      refetchCampaign();
      hide();
    } catch (error: unknown) {
      errorHandler(t, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!campaignName.trim()) {
      NotificationToast.error(t('campaignNameRequired') as string);
      setTouched((prev) => ({ ...prev, campaignName: true }));
      return;
    }

    if (!campaign?.id) {
      NotificationToast.error(t('campaignNotFound') as string);
      return;
    }

    if (!campaignDateRange.startDate || !campaignDateRange.endDate) {
      NotificationToast.error(t('dateRangeRequired') as string);
      return;
    }

    if (
      !dayjs(campaignDateRange.startDate).isValid() ||
      !dayjs(campaignDateRange.endDate).isValid()
    ) {
      NotificationToast.error(t('invalidDate') as string);
      return;
    }

    if (
      dayjs(campaignDateRange.startDate).isAfter(
        dayjs(campaignDateRange.endDate),
      )
    ) {
      NotificationToast.error(t('endDateBeforeStart') as string);
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedFields: { [key: string]: string | number | undefined } = {};

      const trimmedName = campaignName.trim();
      if (campaign?.name !== trimmedName) {
        updatedFields.name = trimmedName;
      }
      if (campaign?.currencyCode !== campaignCurrency) {
        updatedFields.currencyCode = campaignCurrency;
      }
      if (campaign?.goalAmount !== campaignGoal) {
        updatedFields.goalAmount = normalizeGoalAmount(campaignGoal);
      }
      if (
        !dayjs(campaign?.startAt).isSame(dayjs(campaignDateRange.startDate))
      ) {
        updatedFields.startAt = dayjs(
          campaignDateRange.startDate,
        ).toISOString();
      }
      if (!dayjs(campaign?.endAt).isSame(dayjs(campaignDateRange.endDate))) {
        updatedFields.endAt = dayjs(campaignDateRange.endDate).toISOString();
      }

      await updateCampaign({
        variables: {
          input: {
            id: campaign?.id,
            ...updatedFields,
          },
        },
      });
      setFormState({
        campaignName: '',
        campaignCurrency: 'USD',
        campaignGoal: 0,
      });
      setTouched({ campaignName: false });
      refetchCampaign();
      hide();
      NotificationToast.success(t('updatedCampaign') as string);
    } catch (error: unknown) {
      errorHandler(t, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCampaignHandler = async (): Promise<void> => {
    if (isSubmitting || !campaign?.id) return;

    try {
      setIsSubmitting(true);
      await deleteCampaign({
        variables: {
          id: campaign.id,
        },
      });

      NotificationToast.success(t('deletedCampaign') as string);
      setIsDeleteModalOpen(false);
      refetchCampaign();
      hide();
    } catch (error: unknown) {
      errorHandler(t, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CRUDModalTemplate
        className={styles.campaignModal}
        open={isOpen}
        onClose={hide}
        data-testid="campaignModal"
        title={t(mode === 'edit' ? 'manageFundCampaign' : 'createFundCampaign')}
        showFooter={false}
        loading={isSubmitting}
      >
        <form
          id="campaignForm"
          onSubmitCapture={
            mode === 'edit' ? updateCampaignHandler : createCampaignHandler
          }
        >
          {/* Campaign Name */}
          <div className={styles.fieldRow}>
            <FormTextField
              name="campaignName"
              id="campaignName"
              label={t('campaignName')}
              placeholder={t('enterCampaignName')}
              error={isNameInvalid ? tCommon('required') : undefined}
              touched={touched.campaignName}
              value={campaignName}
              data-testid="campaignNameInput"
              onBlur={() =>
                setTouched((prev) => ({ ...prev, campaignName: true }))
              }
              onChange={(value) =>
                setFormState({
                  ...formState,
                  campaignName: value,
                })
              }
            />
          </div>

          {/* Start Date and End Date */}
          <div className={styles.twoColumnRow}>
            <div className={styles.fieldRow}>
              <DatePicker
                name="startDate"
                label={tCommon('startDate')}
                format="DD/MM/YYYY"
                placeholder={t('enterStartDate')}
                value={dayjs(campaignDateRange.startDate)}
                className={styles.noOutline}
                data-testid="campaignStartDate"
                onChange={(date: Dayjs | null): void => {
                  const newStart = date ? date.toDate() : null;

                  setCampaignDateRange((prev: IDateRangeValue) => {
                    let newEnd = prev.endDate;

                    if (date && date.isValid() && prev.endDate) {
                      const startDay = dayjs(date);
                      const endDay = dayjs(prev.endDate);

                      if (startDay.isAfter(endDay)) {
                        newEnd = date.toDate();
                      }
                    }

                    return {
                      startDate: newStart,
                      endDate: newEnd,
                    };
                  });
                }}
                minDate={
                  isEditMode && campaignDateRange.startDate
                    ? dayjs(campaignDateRange.startDate)
                    : dayjs(new Date())
                }
              />
            </div>

            <div className={styles.fieldRow}>
              <DatePicker
                name="endDate"
                label={tCommon('endDate')}
                format="DD/MM/YYYY"
                placeholder={t('enterEndDate')}
                value={dayjs(campaignDateRange.endDate)}
                className={styles.noOutline}
                data-testid="campaignEndDate"
                onChange={(date: Dayjs | null): void => {
                  const newEnd = date ? date.toDate() : null;
                  setCampaignDateRange((prev: IDateRangeValue) => ({
                    ...prev,
                    endDate: newEnd,
                  }));
                }}
                minDate={dayjs(campaignDateRange.startDate)}
              />
            </div>
          </div>

          {/* Currency and Funding Goal */}
          <div className={styles.currencyAndGoalRow}>
            <div className={styles.currencySection}>
              <FormSelectField
                name="campaignCurrency"
                label={t('currency')}
                className={styles.compactInlineGroup}
                value={campaignCurrency}
                data-testid="currencySelect"
                onChange={(value) =>
                  setFormState({
                    ...formState,
                    campaignCurrency: value,
                  })
                }
              >
                {currencyOptions.map((currency) => (
                  <option key={currency.label} value={currency.value}>
                    {currency.label} ({currencySymbols[currency.value]}){' '}
                  </option>
                ))}
              </FormSelectField>
            </div>

            <div className={styles.goalSection}>
              <FormTextField
                id="fundingGoal"
                name="fundingGoal"
                label={t('fundingGoal')}
                className={styles.compactInlineGroup}
                type="number"
                placeholder="0"
                value={String(normalizeGoalAmount(campaignGoal))}
                data-testid="fundingGoalInput"
                onChange={(value) => {
                  setFormState({
                    ...formState,
                    campaignGoal: normalizeGoalAmount(value),
                  });
                }}
                min={0}
              />
            </div>
          </div>

          {mode === 'create' && (
            <Button
              type="submit"
              className={styles.addButton}
              data-testid="submitCampaignBtn"
              disabled={isSubmitting}
              icon={<CreateIcon />}
            >
              {tCommon('create')}
            </Button>
          )}

          {mode === 'edit' && (
            <div className={styles.editActionRow}>
              <Button
                type="submit"
                className={styles.editActionButton}
                data-testid="editCampaignBtn"
                disabled={isSubmitting}
              >
                <i className="fa fa-edit" />
                {tCommon('edit')}
              </Button>

              <Button
                type="button"
                className={styles.deleteActionButton}
                data-testid="deleteCampaignBtn"
                disabled={isSubmitting}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <i className="fa fa-trash" />
                {tCommon('delete')}
              </Button>
            </div>
          )}
        </form>
      </CRUDModalTemplate>

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('deleteCampaign')}
        onDelete={deleteCampaignHandler}
        loading={isSubmitting}
        entityName={campaign?.name}
        data-testid="campaign-delete-modal"
      >
        <p>{t('deleteCampaignMsg')}</p>
      </DeleteModal>
    </>
  );
};

export default CampaignModal;
