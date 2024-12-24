import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceUserInfo,
} from 'utils/interfaces';
import styles from '../../style/app.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PlEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { toast } from 'react-toastify';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

export interface InterfacePledgeModal {
  isOpen: boolean;
  hide: () => void;
  campaignId: string;
  orgId: string;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
  endDate: Date;
  mode: 'create' | 'edit';
}

/**
 * A modal dialog for creating or editing a pledge.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param campaignId - The ID of the campaign associated with the pledge.
 * @param orgId - The ID of the organization associated with the pledge.
 * @param pledge - The pledge object to be edited, or `null` if creating a new pledge.
 * @param refetchPledge - Function to refetch the list of pledges after creation or update.
 * @param endDate - The end date of the campaign to ensure pledge dates are within this range.
 * @param mode - The mode indicating whether the modal is for creating a new pledge or editing an existing one.
 *
 * @returns The rendered modal component.
 *
 * The `PledgeModal` component displays a form within a modal dialog for creating or editing a pledge.
 * It includes fields for selecting users, entering an amount, choosing a currency, and setting start and end dates for the pledge.
 *
 * The modal includes:
 * - A header with a title indicating the current mode (create or edit) and a close button.
 * - A form with:
 *   - A multi-select dropdown for selecting users to participate in the pledge.
 *   - Date pickers for selecting the start and end dates of the pledge.
 *   - A dropdown for selecting the currency of the pledge amount.
 *   - An input field for entering the pledge amount.
 * - A submit button to create or update the pledge.
 *
 * On form submission, the component either:
 * - Calls `updatePledge` mutation to update an existing pledge, or
 * - Calls `createPledge` mutation to create a new pledge.
 *
 * Success or error messages are displayed using toast notifications based on the result of the mutation.
 */

const PledgeModal: React.FC<InterfacePledgeModal> = ({
  isOpen,
  hide,
  campaignId,
  orgId,
  pledge,
  refetchPledge,
  endDate,
  mode,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pledges',
  });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState<InterfaceCreatePledge>({
    pledgeUsers: [],
    pledgeAmount: pledge?.amount ?? 0,
    pledgeCurrency: pledge?.currency ?? 'USD',
    pledgeEndDate: new Date(pledge?.endDate ?? new Date()),
    pledgeStartDate: new Date(pledge?.startDate ?? new Date()),
  });
  const [pledgers, setPledgers] = useState<InterfaceUserInfo[]>([]);
  const [updatePledge] = useMutation(UPDATE_PLEDGE);
  const [createPledge] = useMutation(CREATE_PlEDGE);

  const { data: memberData } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

  useEffect(() => {
    setFormState({
      pledgeUsers: pledge?.users ?? [],
      pledgeAmount: pledge?.amount ?? 0,
      pledgeCurrency: pledge?.currency ?? 'USD',
      pledgeEndDate: new Date(pledge?.endDate ?? new Date()),
      pledgeStartDate: new Date(pledge?.startDate ?? new Date()),
    });
  }, [pledge]);

  useEffect(() => {
    if (memberData) {
      /*istanbul ignore next*/
      setPledgers(memberData.organizations[0].members);
    }
  }, [memberData]);

  const {
    pledgeUsers,
    pledgeAmount,
    pledgeCurrency,
    pledgeStartDate,
    pledgeEndDate,
  } = formState;

  /*istanbul ignore next*/
  const updatePledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const startDate = dayjs(pledgeStartDate).format('YYYY-MM-DD');
      const endDate = dayjs(pledgeEndDate).format('YYYY-MM-DD');

      const updatedFields: {
        [key: string]: number | string | string[] | undefined;
      } = {};
      // checks if there are changes to the pledge and adds them to the updatedFields object
      if (pledgeAmount !== pledge?.amount) {
        updatedFields.amount = pledgeAmount;
      }
      if (pledgeCurrency !== pledge?.currency) {
        updatedFields.currency = pledgeCurrency;
      }
      if (startDate !== dayjs(pledge?.startDate).format('YYYY-MM-DD')) {
        updatedFields.startDate = startDate;
      }
      if (endDate !== dayjs(pledge?.endDate).format('YYYY-MM-DD')) {
        updatedFields.endDate = endDate;
      }
      if (pledgeUsers !== pledge?.users) {
        updatedFields.users = pledgeUsers.map((user) => user._id);
      }
      try {
        await updatePledge({
          variables: {
            id: pledge?._id,
            ...updatedFields,
          },
        });
        toast.success(t('pledgeUpdated') as string);
        refetchPledge();
        hide();
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    },
    [formState, pledge],
  );

  // Function to create a new pledge
  const createPledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        e.preventDefault();
        await createPledge({
          variables: {
            campaignId,
            amount: pledgeAmount,
            currency: pledgeCurrency,
            startDate: dayjs(pledgeStartDate).format('YYYY-MM-DD'),
            endDate: dayjs(pledgeEndDate).format('YYYY-MM-DD'),
            userIds: pledgeUsers.map((user) => user._id),
          },
        });

        toast.success(t('pledgeCreated') as string);
        refetchPledge();
        setFormState({
          pledgeUsers: [],
          pledgeAmount: 0,
          pledgeCurrency: 'USD',
          pledgeEndDate: new Date(),
          pledgeStartDate: new Date(),
        });
        hide();
      } catch (error: unknown) {
        /*istanbul ignore next*/
        toast.error((error as Error).message);
      }
    },
    [formState, campaignId],
  );

  return (
    <Modal className={styles.pledgeModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>
          {t(mode === 'edit' ? 'editPledge' : 'createPledge')}
        </p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="pledgeModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          data-testid="pledgeForm"
          onSubmitCapture={
            mode === 'edit' ? updatePledgeHandler : createPledgeHandler
          }
          className="p-3"
        >
          {/* A Multi-select dropdown enables admin to select more than one pledger for participating in a pledge */}
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              multiple
              className={`${styles.noOutlinePledge} w-100`}
              limitTags={2}
              data-testid="pledgerSelect"
              options={pledgers}
              value={pledgeUsers}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfo): string =>
                `${member.firstName} ${member.lastName}`
              }
              onChange={
                /*istanbul ignore next*/
                (_, newPledgers): void => {
                  setFormState({
                    ...formState,
                    pledgeUsers: newPledgers,
                  });
                }
              }
              renderInput={(params) => (
                <TextField {...params} label="Pledgers" />
              )}
            />
          </Form.Group>
          <Form.Group className="d-flex gap-3 mx-auto  mb-3">
            {/* Date Calendar Component to select start date of an event */}
            <DatePicker
              format="DD/MM/YYYY"
              label={tCommon('startDate')}
              value={dayjs(pledgeStartDate)}
              className={styles.noOutlinePledge}
              onChange={(date: Dayjs | null): void => {
                if (date) {
                  setFormState({
                    ...formState,
                    pledgeStartDate: date.toDate(),
                    pledgeEndDate:
                      pledgeEndDate &&
                      /*istanbul ignore next*/
                      (pledgeEndDate < date?.toDate()
                        ? date.toDate()
                        : pledgeEndDate),
                  });
                }
              }}
              minDate={dayjs(pledgeStartDate)}
              maxDate={dayjs(endDate)}
            />
            {/* Date Calendar Component to select end Date of an event */}
            <DatePicker
              format="DD/MM/YYYY"
              label={tCommon('endDate')}
              className={styles.noOutlinePledge}
              value={dayjs(pledgeEndDate)}
              onChange={(date: Dayjs | null): void => {
                if (date) {
                  setFormState({
                    ...formState,
                    pledgeEndDate: date.toDate(),
                  });
                }
              }}
              minDate={dayjs(pledgeStartDate)}
              maxDate={dayjs(endDate)}
            />
          </Form.Group>
          <Form.Group className="d-flex gap-3 mb-4">
            {/* Dropdown to select the currency in which amount is to be pledged */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t('currency')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={pledgeCurrency}
                label={t('currency')}
                data-testid="currencySelect"
                onChange={
                  /*istanbul ignore next*/
                  (e) => {
                    setFormState({
                      ...formState,
                      pledgeCurrency: e.target.value,
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
            {/* Input field to enter amount to be pledged */}
            <FormControl fullWidth>
              <TextField
                label={t('amount')}
                variant="outlined"
                className={styles.noOutlinePledge}
                value={pledgeAmount}
                onChange={(e) => {
                  if (parseInt(e.target.value) > 0) {
                    setFormState({
                      ...formState,
                      pledgeAmount: parseInt(e.target.value),
                    });
                  }
                }}
              />
            </FormControl>
          </Form.Group>
          {/* Button to submit the pledge form */}
          <Button
            type="submit"
            className={styles.greenregbtnPledge}
            data-testid="submitPledgeBtn"
          >
            {t(mode === 'edit' ? 'updatePledge' : 'createPledge')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default PledgeModal;
