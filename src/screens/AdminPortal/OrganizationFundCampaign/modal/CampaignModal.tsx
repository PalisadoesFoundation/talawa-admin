// translation-check-keyPrefix: fundCampaign
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';

import { currencyOptions, currencySymbols } from 'utils/currency';
import styles from 'style/app-fixed.module.css';

import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import type { InterfaceCampaignModalProps } from 'types/AdminPortal/CampaignModal/interface';

export type InterfaceCampaignModal = InterfaceCampaignModalProps;

import DateRangePicker from 'shared-components/DateRangePicker';
import type { IDateRangeValue } from 'types/shared-components/DateRangePicker/interface';

/**
 * Props for the CampaignModal component.
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
 * - `.addButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

/**
 * Modal component for creating or editing a campaign.
 *
 * @param props - The props for the CampaignModal component.
 * @returns JSX.Element
 */
const CampaignModal: React.FC<InterfaceCampaignModalProps> = ({
  isOpen,
  hide,
  fundId,
  refetchCampaign,
  mode,
  campaign,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });

  const [formState, setFormState] = useState({
    campaignName: campaign?.name ?? '',
    campaignCurrency: campaign?.currencyCode ?? 'USD',
    campaignGoal: campaign?.goalAmount ?? 0,
  });

  const [campaignDateRange, setCampaignDateRange] = useState<IDateRangeValue>({
    startDate: campaign?.startAt ?? null,
    endDate: campaign?.endAt ?? null,
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
  }, [campaign]);

  const { campaignName, campaignCurrency, campaignGoal } = formState;

  const [createCampaign] = useMutation(CREATE_CAMPAIGN_MUTATION);
  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN_MUTATION);

  /**
   * Handles form submission to create a new campaign.
   *
   * @param e - The form event.
   * @returns Promise<void>
   */
  const createCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!campaignDateRange.startDate || !campaignDateRange.endDate) {
      NotificationToast.error(t('dateRangeRequired'));
      return;
    }

    try {
      await createCampaign({
        variables: {
          name: formState.campaignName,
          currencyCode: formState.campaignCurrency,
          goalAmount: Number.parseInt(formState.campaignGoal.toString()),
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

      setCampaignDateRange({ startDate: null, endDate: null });

      refetchCampaign();
      hide();
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  /**
   * Handles form submission to update an existing campaign.
   *
   * @param e - The form event.
   * @returns Promise<void>
   */

  const updateCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!campaignDateRange.startDate || !campaignDateRange.endDate) {
      NotificationToast.error(t('dateRangeRequired'));
      return;
    }

    if (!campaign?.id) {
      NotificationToast.error(t('campaignNotFound'));
      return;
    }

    try {
      const updatedFields: { [key: string]: string | number | undefined } = {};
      if (campaign?.name !== campaignName) {
        updatedFields.name = campaignName;
      }
      if (campaign?.currencyCode !== campaignCurrency) {
        updatedFields.currencyCode = campaignCurrency;
      }
      if (campaign?.goalAmount !== campaignGoal) {
        updatedFields.goalAmount = campaignGoal;
      }
      if (
        campaign?.startAt?.toISOString() !==
        campaignDateRange.startDate?.toISOString()
      ) {
        if (campaignDateRange.startDate) {
          updatedFields.startAt = dayjs(
            campaignDateRange.startDate,
          ).toISOString();
        }
      }

      if (
        campaign?.endAt?.toISOString() !==
        campaignDateRange.endDate?.toISOString()
      ) {
        if (campaignDateRange.endDate) {
          updatedFields.endAt = dayjs(campaignDateRange.endDate).toISOString();
        }
      }

      await updateCampaign({
        variables: {
          input: {
            id: campaign.id,
            ...updatedFields,
          },
        },
      });
      setFormState({
        campaignName: '',
        campaignCurrency: 'USD',
        campaignGoal: 0,
      });
      setCampaignDateRange({ startDate: null, endDate: null });

      refetchCampaign();
      hide();
      NotificationToast.success(t('updatedCampaign') as string);
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };
  return (
    <>
      <BaseModal
        className={styles.campaignModal}
        show={isOpen}
        onHide={hide}
        title={t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
        dataTestId="campaignModal"
      >
        <Form
          onSubmitCapture={
            mode === 'edit' ? updateCampaignHandler : createCampaignHandler
          }
          className="p-3"
        >
          <Form.Group className="d-flex mb-3 w-100">
            <FormControl fullWidth>
              <TextField
                label={t('campaignName')}
                variant="outlined"
                className={`${styles.noOutline} w-100`}
                value={campaignName}
                onChange={(e) =>
                  setFormState({ ...formState, campaignName: e.target.value })
                }
              />
            </FormControl>
          </Form.Group>

          <Form.Group className="mb-3">
            <DateRangePicker
              value={campaignDateRange}
              onChange={setCampaignDateRange}
              dataTestId="campaign-date-range"
            />
          </Form.Group>

          <Form.Group className="d-flex gap-4 mb-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t('currency')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={campaignCurrency}
                label={t('currency')}
                data-testid="currencySelect"
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    campaignCurrency: e.target.value,
                  });
                }}
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency.label} value={currency.value}>
                    {currency.label} ({currencySymbols[currency.value]})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label={t('fundingGoal')}
                variant="outlined"
                className={styles.noOutline}
                value={campaignGoal}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 0) {
                    setFormState({
                      ...formState,
                      campaignGoal: value,
                    });
                  }
                }}
              />
            </FormControl>
          </Form.Group>

          <Button
            type="submit"
            className={styles.addButton}
            data-testid="submitCampaignBtn"
          >
            {t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
          </Button>
        </Form>
      </BaseModal>
    </>
  );
};

export default CampaignModal;
