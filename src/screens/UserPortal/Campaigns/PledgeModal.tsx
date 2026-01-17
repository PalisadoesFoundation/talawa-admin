/**
 * @file PledgeModal.tsx
 * @description This file defines the `PledgeModal` component, which provides a modal interface for creating or editing pledges
 *              in a campaign. It includes form fields for selecting pledgers, specifying pledge amounts, currencies, and dates.
 *              The component supports internationalization and integrates with GraphQL mutations and queries for data handling.
 *
 * @module PledgeModal
 *
 * @typedef {InterfacePledgeModal} InterfacePledgeModal
 * @property {boolean} isOpen - Indicates whether the modal is open or closed.
 * @property {() => void} hide - Function to close the modal.
 * @property {string} campaignId - The ID of the campaign associated with the pledge.
 * @property {string} userId - The ID of the user creating or editing the pledge.
 * @property {InterfacePledgeInfo | null} pledge - The pledge data to edit, or null for creating a new pledge.
 * @property {() => void} refetchPledge - Function to refetch the pledge data after updates.
 * @property {Date} endDate - The maximum allowed end date for the pledge.
 * @property {'create' | 'edit'} mode - The mode of the modal, either 'create' or 'edit'.
 */

/**
 * @component
 * @name PledgeModal
 * @description A modal component for creating or editing pledges. It includes form fields for selecting pledgers,
 *              specifying pledge amounts, currencies, and dates. The component supports internationalization and
 *              integrates with GraphQL for data handling.
 *
 * @param {InterfacePledgeModal} props - The props for the PledgeModal component.
 * @returns {JSX.Element} The rendered PledgeModal component.
 *
 * @example
 * <PledgeModal
 *   isOpen={true}
 *   hide={() => {}}
 *   campaignId="123"
 *   userId="456"
 *   pledge={null}
 *   refetchPledge={() => {}}
 *   endDate={new Date()}
 *   mode="create"
 * />
 */
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import styles from '../../../style/app-fixed.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { toast } from 'react-toastify';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';

export interface InterfacePledgeModal {
  isOpen: boolean;
  hide: () => void;
  campaignId: string;
  userId: string;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
  endDate: Date;
  mode: 'create' | 'edit';
}

const PledgeModal: React.FC<InterfacePledgeModal> = ({
  isOpen,
  hide,
  campaignId,
  userId,
  pledge,
  refetchPledge,
  endDate,
  mode,
}) => {
  // Translation functions to support internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });
  const { t: tCommon } = useTranslation('common');

  // State to manage the form inputs for the pledge
  const [formState, setFormState] = useState<InterfaceCreatePledge>({
    pledgeUsers: [],
    pledgeAmount: pledge?.amount ?? 0,
    pledgeCurrency: pledge?.currency ?? 'USD',
    pledgeEndDate: new Date(pledge?.endDate ?? new Date()),
    pledgeStartDate: new Date(pledge?.startDate ?? new Date()),
  });

  // State to manage the list of pledgers (users who are part of the pledge)
  const [pledgers, setPledgers] = useState<InterfaceUserInfoPG[]>([]);

  // Mutation to update an existing pledge
  const [updatePledge] = useMutation(UPDATE_PLEDGE);

  // Mutation to create a new pledge
  const [createPledge] = useMutation(CREATE_PLEDGE);

  // Effect to update the form state when the pledge prop changes (e.g., when editing a pledge)
  useEffect(() => {
    if (pledge) {
      setFormState({
        pledgeUsers: pledge.pledger ? [pledge.pledger] : [],
        pledgeAmount: pledge?.amount ?? 0,
        pledgeCurrency: pledge?.currency ?? 'USD',
        pledgeEndDate: new Date(pledge?.endDate ?? new Date()),
        pledgeStartDate: new Date(pledge?.startDate ?? new Date()),
      });
    }
  }, [pledge]);

  // Destructuring the form state for easier access
  const {
    pledgeUsers,
    pledgeAmount,
    pledgeCurrency,
    pledgeStartDate,
    pledgeEndDate,
  } = formState;

  // Query to get the user details based on the userId prop
  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  // Effect to update the pledgers state when user data is fetched
  useEffect(() => {
    if (userData) {
      setPledgers([
        {
          id: userData.user.user._id,
          firstName: userData.user.user.firstName,
          lastName: userData.user.user.lastName,
          name: `${userData.user.user.firstName} ${userData.user.user.lastName}`,
          avatarURL: userData.user.user.image,
        },
      ]);
    }
  }, [userData]);

  /**
   * Handler function to update an existing pledge.
   * It compares the current form state with the existing pledge and updates only the changed fields.
   *
   * @param e - The form submission event.
   * @returns A promise that resolves when the pledge is successfully updated.
   */

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
      if (
        pledgeUsers.length > 0 &&
        pledgeUsers[0]?.id !== pledge?.pledger?.id
      ) {
        updatedFields.pledgerId = pledgeUsers[0].id;
      }
      try {
        await updatePledge({
          variables: { id: pledge?.id, ...updatedFields },
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

  /**
   * Handler function to create a new pledge.
   * It collects the form data and sends a request to create a pledge with the specified details.
   *
   * @param e - The form submission event.
   * @returns A promise that resolves when the pledge is successfully created.
   */
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
            userIds: pledgeUsers.map((user) => user.id),
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
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              multiple
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="pledgerSelect"
              options={[...pledgers, ...pledgeUsers]}
              value={pledgeUsers}
              readOnly={mode === 'edit'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfoPG): string =>
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
            <DatePicker
              format="DD/MM/YYYY"
              label={tCommon('startDate')}
              value={dayjs(pledgeStartDate)}
              className={styles.noOutline}
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
            <DatePicker
              format="DD/MM/YYYY"
              label={tCommon('endDate')}
              className={styles.noOutline}
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
            <FormControl fullWidth>
              <TextField
                label={t('amount')}
                variant="outlined"
                className={styles.noOutline}
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
