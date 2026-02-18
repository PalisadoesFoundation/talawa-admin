import DatePicker from 'shared-components/DatePicker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
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
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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

  const [formState, setFormState] = useState({
    campaignName: campaign?.name ?? '',
    campaignCurrency: campaign?.currencyCode ?? 'USD',
    campaignGoal: campaign?.goalAmount ?? 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      campaignGoal: campaign?.goalAmount ?? 0,
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
          goalAmount: Number(campaignGoal),
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
        updatedFields.goalAmount = Number(campaignGoal);
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

  return (
    <CRUDModalTemplate
      className={styles.campaignModal}
      open={isOpen}
      onClose={hide}
      data-testid="campaignModal"
      title={t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
      showFooter={false}
      loading={isSubmitting}
    >
      <form
        onSubmitCapture={
          mode === 'edit' ? updateCampaignHandler : createCampaignHandler
        }
        className="p-3"
      >
        <div className="d-flex mb-3 w-100">
          <FormTextField
            name="campaignName"
            label={t('campaignName')}
            required
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

        <div className="d-flex gap-4 mx-auto mb-3">
          <DatePicker
            format="DD/MM/YYYY"
            label={tCommon('startDate')}
            value={dayjs(campaignDateRange.startDate)}
            className={styles.noOutline}
            data-testid="campaignStartDate"
            onChange={(date: Dayjs | null): void => {
              // We must update state even if null/invalid to let validation catch it
              const newStart = date ? date.toDate() : null;

              setCampaignDateRange((prev: IDateRangeValue) => {
                let newEnd = prev.endDate;

                // Auto-update end date if start date moves after it
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
            minDate={dayjs(new Date())}
          />

          <DatePicker
            format="DD/MM/YYYY"
            label={tCommon('endDate')}
            className={styles.noOutline}
            value={dayjs(campaignDateRange.endDate)}
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

        <div className="d-flex gap-4 mb-4">
          <FormSelectField
            name="campaign-currency"
            label={t('currency')}
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
                {currency.label} ({currencySymbols[currency.value]})
              </option>
            ))}
          </FormSelectField>

          <FormTextField
            name="fundingGoal"
            label={t('fundingGoal')}
            type="number"
            value={String(campaignGoal)}
            data-testid="fundingGoalInput"
            onChange={(value) => {
              if (value === '') {
                setFormState({
                  ...formState,
                  campaignGoal: 0,
                });
              } else {
                const parsed = parseInt(value);
                if (!isNaN(parsed)) {
                  setFormState({
                    ...formState,
                    campaignGoal: Math.max(0, parsed),
                  });
                }
              }
            }}
          />
        </div>

        <Button
          type="submit"
          className={styles.addButton}
          data-testid="submitCampaignBtn"
          disabled={isSubmitting}
        >
          {t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
        </Button>
      </form>
    </CRUDModalTemplate>
  );
};

export default CampaignModal;
