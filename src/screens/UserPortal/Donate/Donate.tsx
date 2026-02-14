import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormControl, InputGroup } from 'react-bootstrap';
import DropDownButton from 'shared-components/DropDownButton';
import Button from 'shared-components/Button';
import { useQuery, useMutation } from '@apollo/client';
import SendIcon from '@mui/icons-material/Send';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import {
  DONATE_TO_ORGANIZATION,
  DONATE_TO_ORGANIZATION_WITH_CURRENCY,
} from 'GraphQl/Mutations/mutations';
import styles from './Donate.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { errorHandler } from 'utils/errorHandler';
import PaginationList from 'shared-components/PaginationList/PaginationList';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { InterfaceDonation } from 'types/UserPortal/Donation/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

const currencies = ['USD', 'INR', 'EUR'];
const currencyOptions = currencies.map((currency) => ({
  value: currency,
  label: currency,
}));

interface IDonationTableRow {
  id: string;
  donor: string;
  amount: number;
  updatedAt: string;
}

/**
 * Component for handling donations to an organization.
 * Allows users to make donations and view their donation history.
 *
 * @returns The Donate component.
 */
export default function Donate(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'donate' });

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const userName = getItem('name');

  const { orgId: organizationId } = useParams();

  const [amount, setAmount] = useState('');
  const [organizationDetails, setOrganizationDetails] = useState<{
    name: string;
  }>({ name: '' });
  const [donations, setDonations] = useState<InterfaceDonation[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const {
    data: donationData,
    loading,
    refetch,
  } = useQuery(ORGANIZATION_DONATION_CONNECTION_LIST, {
    variables: { orgId: organizationId },
  });

  const { data } = useQuery(ORGANIZATION_LIST, {
    variables: { id: organizationId },
  });

  const [donate] = useMutation(DONATE_TO_ORGANIZATION);
  const [donateWithCurrency] = useMutation(
    DONATE_TO_ORGANIZATION_WITH_CURRENCY,
  );

  const donationRows: IDonationTableRow[] = React.useMemo(
    () =>
      donations.map((donation) => ({
        id: donation._id,
        donor: donation.nameOfUser,
        amount: Number(donation.amount),
        updatedAt: donation.updatedAt,
      })),
    [donations],
  );

  const filteredDonationRows = React.useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return donationRows;
    }

    return donationRows.filter((donation) => {
      const matchesDonor = donation.donor.toLowerCase().includes(query);
      const matchesAmount = String(donation.amount).includes(query);
      const matchesDate = donation.updatedAt.toLowerCase().includes(query);
      return matchesDonor || matchesAmount || matchesDate;
    });
  }, [donationRows, searchText]);

  const paginatedDonationRows = React.useMemo(
    () =>
      filteredDonationRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [filteredDonationRows, page, rowsPerPage],
  );

  const donationColumns: IColumnDef<IDonationTableRow>[] = React.useMemo(
    () => [
      {
        id: 'donor',
        header: t('donor'),
        accessor: 'donor',
        render: (value) => (
          <span data-testid="donationCard">{String(value)}</span>
        ),
      },
      {
        id: 'amount',
        header: t('amount'),
        accessor: 'amount',
        render: (value) => {
          // ORGANIZATION_DONATION_CONNECTION_LIST does not yet return per-donation currencyCode.
          // When it does, wire row currency formatting here (e.g., with `currencySymbols`) instead of `selectedCurrency`.
          return Number(value);
        },
      },
      {
        id: 'updatedAt',
        header: t('date'),
        accessor: 'updatedAt',
        render: (value) => dayjs(String(value)).format('YYYY-MM-DD HH:mm'),
      },
    ],
    [t],
  );

  useEffect(() => {
    if (data?.organizations) {
      setOrganizationDetails(data.organizations[0]);
    }
  }, [data]);

  useEffect(() => {
    if (donationData?.getDonationByOrgIdConnection) {
      setDonations(donationData.getDonationByOrgIdConnection);
    }
  }, [donationData]);

  useEffect(() => {
    setPage(0);
  }, [searchText]);

  const handleCurrencyChange = (currency: string): void => {
    setSelectedCurrency(currency);
    setPage(0);
  };

  const shouldFallbackToLegacyDonationMutation = (error: unknown): boolean => {
    const apolloError = error as {
      graphQLErrors?: Array<{ message?: string }>;
      message?: string;
    };

    const combinedMessage = [
      apolloError?.message,
      ...(apolloError?.graphQLErrors?.map((e) => e?.message) ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const shouldFallback =
      combinedMessage.includes('unknown argument "currencycode"') ||
      combinedMessage.includes('unknown type "iso4217currencycode"') ||
      combinedMessage.includes(
        'field "createdonation" argument "currencycode" is not defined',
      );

    if (shouldFallback) {
      console.error(
        'Currency-aware donation unsupported by backend, falling back to legacy mutation',
        {
          error,
          combinedMessage,
        },
      );
    }

    return shouldFallback;
  };

  const donateToOrg = async (): Promise<void> => {
    if (!userId || organizationId == null || !userName) {
      console.error('Missing required donation identifiers for mutation.', {
        userId,
        organizationId,
        userName,
      });
      return;
    }

    if (amount === '' || Number.isNaN(Number(amount))) {
      NotificationToast.error(t('invalidAmount'));
      return;
    }

    const minDonation = 1;
    const maxDonation = 10000000;

    if (Number(amount) < minDonation || Number(amount) > maxDonation) {
      NotificationToast.error(
        t('donationOutOfRange', { min: minDonation, max: maxDonation }),
      );
      return;
    }

    try {
      try {
        await donateWithCurrency({
          variables: {
            userId,
            createDonationOrgId2: organizationId,
            payPalId: 'paypalId',
            nameOfUser: userName,
            amount: Number(amount),
            nameOfOrg: organizationDetails.name,
            currencyCode: selectedCurrency,
          },
        });
      } catch (error) {
        if (shouldFallbackToLegacyDonationMutation(error)) {
          await donate({
            variables: {
              userId,
              createDonationOrgId2: organizationId,
              payPalId: 'paypalId',
              nameOfUser: userName,
              amount: Number(amount),
              nameOfOrg: organizationDetails.name,
            },
          });
        } else {
          throw error;
        }
      }

      await refetch();
      NotificationToast.success(t('success') as string);
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <div className="mt-4">
      <div className={styles.mainContainer50}>
        <SearchFilterBar
          searchPlaceholder={t('searchDonations')}
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchInputTestId="searchInput"
          searchButtonTestId="searchButton"
          containerClassName={styles.donateSearchContainer}
          hasDropdowns={false}
        />

        <div className={styles.box}>
          <div className={styles.heading}>
            {t('donateForThe')} {organizationDetails.name}
          </div>

          <InputGroup className={styles.width100}>
            <DropDownButton
              id="currency-dropdown"
              options={currencyOptions}
              selectedValue={selectedCurrency}
              onSelect={handleCurrencyChange}
              variant="success"
              btnStyle={`${styles.colorPrimary} ${styles.dropdown}`}
              dataTestIdPrefix="currency-dropdown"
              buttonLabel={selectedCurrency}
              ariaLabel={t('selectCurrency')}
            />

            <label htmlFor="donationAmountInput" className="visually-hidden">
              {t('amount')}
            </label>
            <FormControl
              id="donationAmountInput"
              type="text"
              data-testid="donationAmount"
              placeholder={t('amount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputGroup>

          <Button
            size="sm"
            data-testid="donateBtn"
            onClick={donateToOrg}
            className={`${styles.addButton} ${styles.donateBtn}`}
            variant="primary"
          >
            {t('donate')} <SendIcon />
          </Button>
        </div>

        <div className={styles.container}>
          <h5>{t('yourPreviousDonations')}</h5>

          {loading ? (
            <div data-testid="loading-state">
              <HourglassBottomIcon /> Loading...
            </div>
          ) : filteredDonationRows.length > 0 ? (
            <DataTable<IDonationTableRow>
              data={paginatedDonationRows}
              columns={donationColumns}
              rowKey="id"
              paginationMode="none"
            />
          ) : (
            <span>{t('nothingToShow')}</span>
          )}

          <PaginationList
            count={filteredDonationRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
