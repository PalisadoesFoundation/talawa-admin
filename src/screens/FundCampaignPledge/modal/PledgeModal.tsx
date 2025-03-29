/**
 * @file PledgeModal.tsx
 * @description A React component for creating or editing a pledge within a modal dialog.
 *
 * @module PledgeModal
 *
 * @remarks
 * This component provides a form for managing pledges, allowing users to:
 * - Select participants (pledgers) for the pledge.
 * - Specify the pledge amount and currency.
 * - Set start and end dates for the pledge.
 *
 * The modal supports two modes:
 * - `create`: For creating a new pledge.
 * - `edit`: For editing an existing pledge.
 *
 * @param {boolean} isOpen - Indicates whether the modal is open.
 * @param {() => void} hide - Function to close the modal.
 * @param {string} campaignId - The ID of the campaign associated with the pledge.
 * @param {string} orgId - The ID of the organization associated with the pledge.
 * @param {InterfacePledgeInfo | null} pledge - The pledge object to edit, or `null` for a new pledge.
 * @param {() => void} refetchPledge - Function to refetch the list of pledges after creation or update.
 * @param {Date} endDate - The campaign's end date to validate pledge dates.
 * @param {'create' | 'edit'} mode - The mode of the modal, either 'create' or 'edit'.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @example
 * <PledgeModal
 *   isOpen={true}
 *   hide={() => {}}
 *   campaignId="123"
 *   orgId="456"
 *   pledge={null}
 *   refetchPledge={() => {}}
 *   endDate={new Date()}
 *   mode="create"
 * />
 *
 * @dependencies
 * - React
 * - Apollo Client for GraphQL queries and mutations.
 * - Material-UI and Bootstrap for UI components.
 * - Day.js for date manipulation.
 * - React-Toastify for notifications.
 *
 * @css
 * - Uses global styles from `app-fixed.module.css`.
 * - Reusable class `.addButton` for consistent button styling.
 */
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
import styles from 'style/app-fixed.module.css';
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
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });
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
      setPledgers(memberData.organization[0].members);
    }
  }, [memberData]);

  const {
    pledgeUsers,
    pledgeAmount,
    pledgeCurrency,
    pledgeStartDate,
    pledgeEndDate,
  } = formState;

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
          variables: { id: pledge?._id, ...updatedFields },
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
              onChange={(_, newPledgers): void => {
                setFormState({ ...formState, pledgeUsers: newPledgers });
              }}
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
                  setFormState({ ...formState, pledgeEndDate: date.toDate() });
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
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    pledgeCurrency: e.target.value,
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
            className={styles.addButton}
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
