import DatePicker from 'shared-components/DatePicker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
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
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import type { InterfaceCampaignModal } from './types';

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
    campaignStartDate: campaign?.startAt ?? new Date(),
    campaignEndDate: campaign?.endAt ?? new Date(),
  });

  const [touched, setTouched] = useState<{ campaignName: boolean }>({
    campaignName: false,
  });

  useEffect(() => {
    setFormState({
      campaignCurrency: campaign?.currencyCode ?? 'USD',
      campaignEndDate: campaign?.endAt ?? new Date(),
      campaignGoal: campaign?.goalAmount ?? 0,
      campaignName: campaign?.name ?? '',
      campaignStartDate: campaign?.startAt ?? new Date(),
    });
    setTouched({ campaignName: false });
  }, [campaign]);

  const {
    campaignName,
    campaignCurrency,
    campaignEndDate,
    campaignGoal,
    campaignStartDate,
  } = formState;

  const [createCampaign] = useMutation(CREATE_CAMPAIGN_MUTATION);
  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN_MUTATION);

  const isNameInvalid = touched.campaignName && !campaignName.trim();

  const createCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!campaignName.trim()) {
      setTouched((prev) => ({ ...prev, campaignName: true }));
      return;
    }

    try {
      await createCampaign({
        variables: {
          name: campaignName,
          currencyCode: campaignCurrency,
          goalAmount: campaignGoal,
          startAt: dayjs(campaignStartDate).toISOString(),
          endAt: dayjs(campaignEndDate).toISOString(),
          fundId,
        },
      });
      NotificationToast.success(t('createdCampaign') as string);
      setFormState({
        campaignName: '',
        campaignCurrency: 'USD',
        campaignGoal: 0,
        campaignStartDate: new Date(),
        campaignEndDate: new Date(),
      });
      setTouched({ campaignName: false });
      refetchCampaign();
      hide();
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const updateCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!campaignName.trim()) {
      setTouched((prev) => ({ ...prev, campaignName: true }));
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
      if (!dayjs(campaign?.startAt).isSame(dayjs(campaignStartDate))) {
        updatedFields.startAt = dayjs(campaignStartDate).toISOString();
      }
      if (!dayjs(campaign?.endAt).isSame(dayjs(campaignEndDate))) {
        updatedFields.endAt = dayjs(campaignEndDate).toISOString();
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
        campaignStartDate: new Date(),
        campaignEndDate: new Date(),
      });
      setTouched({ campaignName: false });
      refetchCampaign();
      hide();
      NotificationToast.success(t('updatedCampaign') as string);
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <BaseModal
      className={styles.campaignModal}
      show={isOpen}
      onHide={hide}
      headerContent={
        <div className="d-flex justify-content-between align-items-center">
          <p className={styles.titlemodal}>
            {t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
          </p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.closeButton}
            data-testid="campaignCloseBtn"
          >
            <i className="fa fa-times" />
          </Button>
        </div>
      }
    >
      <Form
        onSubmitCapture={
          mode === 'edit' ? updateCampaignHandler : createCampaignHandler
        }
        className="p-3"
      >
        <div className="d-flex mb-3 w-100">
          <FormFieldGroup
            name="campaignName"
            label={t('campaignName')}
            error={isNameInvalid ? tCommon('required') : undefined}
            touched={touched.campaignName}
          >
            <FormControl fullWidth>
              <TextField
                id="campaignName"
                variant="outlined"
                className={`${styles.noOutline} w-100`}
                value={campaignName}
                error={isNameInvalid}
                inputProps={{ 'aria-describedby': 'campaignName-error' }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, campaignName: true }))
                }
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    campaignName: e.target.value,
                  })
                }
              />
            </FormControl>
          </FormFieldGroup>
        </div>

        <Form.Group className="d-flex gap-4 mx-auto mb-3">
          <DatePicker
            format="DD/MM/YYYY"
            label={tCommon('startDate')}
            value={dayjs(campaignStartDate)}
            className={styles.noOutline}
            data-testid="campaignStartDate"
            onChange={(date: Dayjs | null): void => {
              if (date) {
                setFormState({
                  ...formState,
                  campaignStartDate: date.toDate(),
                  campaignEndDate:
                    campaignEndDate && campaignEndDate < date.toDate()
                      ? date.toDate()
                      : campaignEndDate,
                });
              }
            }}
            minDate={dayjs(new Date())}
          />

          <DatePicker
            format="DD/MM/YYYY"
            label={tCommon('endDate')}
            className={styles.noOutline}
            value={dayjs(campaignEndDate)}
            data-testid="campaignEndDate"
            onChange={(date: Dayjs | null): void => {
              if (date) {
                setFormState({
                  ...formState,
                  campaignEndDate: date.toDate(),
                });
              }
            }}
            minDate={dayjs(campaignStartDate)}
          />
        </Form.Group>

        <Form.Group className="d-flex gap-4 mb-4">
          <FormControl fullWidth>
            <InputLabel id="campaign-currency-label">
              {t('currency')}
            </InputLabel>
            <Select
              labelId="campaign-currency-label"
              id="campaign-currency"
              value={campaignCurrency}
              label={t('currency')}
              data-testid="currencySelect"
              onChange={(e) =>
                setFormState({
                  ...formState,
                  campaignCurrency: e.target.value,
                })
              }
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
                const val = Number(e.target.value);
                if (val > 0) {
                  setFormState({
                    ...formState,
                    campaignGoal: val,
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
  );
};

export default CampaignModal;
