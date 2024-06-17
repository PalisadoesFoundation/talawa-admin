import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfacePledgeVolunteer,
} from 'utils/interfaces';
import styles from './FundCampaignPledge.module.css';
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
  const [volunteers, setVolunteers] = useState<InterfacePledgeVolunteer[]>([]);
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
      setVolunteers(memberData.organizations[0].members);
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
        toast.success(t('pledgeUpdated'));
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

        toast.success(t('pledgeCreated'));
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
          {/* A Multi-select dropdown enables admin to select more than one volunteer for participating in a pledge */}
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              multiple
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="volunteerSelect"
              options={volunteers}
              value={pledgeUsers}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfacePledgeVolunteer): string =>
                `${member.firstName} ${member.lastName}`
              }
              onChange={
                /*istanbul ignore next*/
                (_, newVolunteers): void => {
                  setFormState({
                    ...formState,
                    pledgeUsers: newVolunteers,
                  });
                }
              }
              renderInput={(params) => (
                <TextField {...params} label="Volunteers" />
              )}
            />
          </Form.Group>
          <Form.Group className="d-flex gap-3 mx-auto  mb-3">
            {/* Date Calendar Component to select start date of an event */}
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
              className={styles.noOutline}
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
          {/* Button to submit the pledge form */}
          <Button
            type="submit"
            className={styles.greenregbtn}
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
