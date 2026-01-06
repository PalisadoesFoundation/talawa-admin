// translation-check-keyPrefix: fundCampaign
import { DatePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import styles from 'style/app-fixed.module.css';

import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { InterfaceCampaignInfo } from 'utils/interfaces';
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
export interface InterfaceCampaignModal {
  isOpen: boolean;
  hide: () => void;
  fundId: string;
  orgId: string;
  campaign: InterfaceCampaignInfo | null;
  refetchCampaign: () => void;
  mode: 'create' | 'edit';
}

/**
 * Modal component for creating or editing a campaign.
 *
 * @param props - The props for the CampaignModal component.
 * @returns JSX.Element
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

  useEffect(() => {
    setFormState({
      campaignCurrency: campaign?.currencyCode ?? 'USD',
      campaignEndDate: campaign?.endAt ?? new Date(),
      campaignGoal: campaign?.goalAmount ?? 0,
      campaignName: campaign?.name ?? '',
      campaignStartDate: campaign?.startAt ?? new Date(),
    });
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
    try {
      await createCampaign({
        variables: {
          name: formState.campaignName,
          currencyCode: formState.campaignCurrency,
          goalAmount: Number.parseInt(formState.campaignGoal.toString()),
          startAt: dayjs(formState.campaignStartDate).toISOString(),
          endAt: dayjs(formState.campaignEndDate).toISOString(),
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
      if (campaign?.startAt !== campaignStartDate) {
        updatedFields.startAt = dayjs(campaignStartDate).toISOString();
      }
      if (campaign?.endAt !== formState.campaignEndDate) {
        updatedFields.endAt = dayjs(formState.campaignEndDate).toISOString();
      }
      await updateCampaign({
        variables: {
          input: {
            id: campaign?.id, // Ensure the id field is the campaign id
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
      refetchCampaign();
      hide();
      NotificationToast.success(t('updatedCampaign') as string);
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      <Modal className={styles.campaignModal} show={isOpen} onHide={hide}>
        <Modal.Header>
          <p className={styles.titlemodal}>
            {t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
          </p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.closeButton}
            data-testid="campaignCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
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

            <Form.Group className="d-flex gap-4 mx-auto mb-3">
              {/* Date Calendar Component to select start date of campaign*/}
              <DatePicker
                format="DD/MM/YYYY"
                label={tCommon('startDate')}
                value={dayjs(campaignStartDate)}
                className={styles.noOutline}
                onChange={(date: Dayjs | null): void => {
                  if (date) {
                    setFormState({
                      ...formState,
                      campaignStartDate: date.toDate(),
                      campaignEndDate:
                        campaignEndDate &&
                        (campaignEndDate < date?.toDate()
                          ? date.toDate()
                          : campaignEndDate),
                    });
                  }
                }}
                minDate={dayjs(new Date())}
              />
              {/* Date Calendar Component to select end Date of campaign */}
              <DatePicker
                format="DD/MM/YYYY"
                label={tCommon('endDate')}
                className={styles.noOutline}
                value={dayjs(campaignEndDate)}
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
              {/* Dropdown to select the currency for funding goal of the campaign*/}
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
              {/* Input field to enter funding goal for the campaign */}
              <FormControl fullWidth>
                <TextField
                  label={t('fundingGoal')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={campaignGoal}
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 0) {
                      setFormState({
                        ...formState,
                        campaignGoal: parseInt(e.target.value),
                      });
                    }
                  }}
                />
              </FormControl>
            </Form.Group>
            {/* Button to create the campaign */}
            <Button
              type="submit"
              className={styles.addButton}
              data-testid="submitCampaignBtn"
            >
              {t(mode === 'edit' ? 'updateCampaign' : 'createCampaign')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CampaignModal;
