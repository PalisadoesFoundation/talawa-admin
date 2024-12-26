import { DatePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import styles from '../../style/app.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { toast } from 'react-toastify';
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
  orgId,
  refetchCampaign,
  mode,
  campaign,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'fundCampaign',
  });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState({
    campaignName: campaign?.name ?? '',
    campaignCurrency: campaign?.currency ?? 'USD',
    campaignGoal: campaign?.fundingGoal ?? 0,
    campaignStartDate: campaign?.startDate ?? new Date(),
    campaignEndDate: campaign?.endDate ?? new Date(),
  });

  useEffect(() => {
    setFormState({
      campaignCurrency: campaign?.currency ?? 'USD',
      campaignEndDate: campaign?.endDate ?? new Date(),
      campaignGoal: campaign?.fundingGoal ?? 0,
      campaignName: campaign?.name ?? '',
      campaignStartDate: campaign?.startDate ?? new Date(),
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
          currency: formState.campaignCurrency,
          fundingGoal: formState.campaignGoal,
          organizationId: orgId,
          startDate: dayjs(formState.campaignStartDate).format('YYYY-MM-DD'),
          endDate: dayjs(formState.campaignEndDate).format('YYYY-MM-DD'),
          fundId,
        },
      });
      toast.success(t('createdCampaign') as string);
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
      toast.error((error as Error).message);
    }
  };

  /**
   * Handles form submission to update an existing campaign.
   *
   * @param e - The form event.
   * @returns Promise<void>
   */
  /*istanbul ignore next*/
  const updateCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedFields: { [key: string]: string | number | undefined } = {};
      if (campaign?.name !== campaignName) {
        updatedFields.name = campaignName;
      }
      if (campaign?.currency !== campaignCurrency) {
        updatedFields.currency = campaignCurrency;
      }
      if (campaign?.fundingGoal !== campaignGoal) {
        updatedFields.fundingGoal = campaignGoal;
      }
      if (campaign?.startDate !== campaignStartDate) {
        updatedFields.startDate = dayjs(campaignStartDate).format('YYYY-MM-DD');
      }
      if (campaign?.endDate !== formState.campaignEndDate) {
        updatedFields.endDate = dayjs(formState.campaignEndDate).format(
          'YYYY-MM-DD',
        );
      }
      await updateCampaign({
        variables: {
          id: campaign?._id,
          ...updatedFields,
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
      toast.success(t('updatedCampaign') as string);
    } catch (error: unknown) {
      toast.error((error as Error).message);
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
            className={styles.modalCloseBtn}
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
                    setFormState({
                      ...formState,
                      campaignName: e.target.value,
                    })
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
                  onChange={
                    /*istanbul ignore next*/
                    (e) => {
                      setFormState({
                        ...formState,
                        campaignCurrency: e.target.value,
                      });
                    }
                  }
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
              className={styles.greenregbtnOrganizationFundCampaign}
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
