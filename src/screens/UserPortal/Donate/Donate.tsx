import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { useQuery, useMutation } from '@apollo/client';
import SendIcon from '@mui/icons-material/Send';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useTranslation } from 'react-i18next';

import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';
import styles from './Donate.module.css';
import DonationCard from 'components/UserPortal/DonationCard/DonationCard';
import useLocalStorage from 'utils/useLocalstorage';
import { errorHandler } from 'utils/errorHandler';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import PaginationList from 'shared-components/PaginationList/PaginationList';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import {
  InterfaceDonation,
  InterfaceDonationCardProps,
} from 'types/UserPortal/Donation/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

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
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const currencies = ['USD', 'INR', 'EUR'];

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

  const donateToOrg = async (): Promise<void> => {
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

      refetch();
      NotificationToast.success(t('success') as string);
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <div className="d-flex flex-row mt-4">
      <div className={`${styles.mainContainer50} me-4`}>
        <SearchFilterBar
          searchPlaceholder={t('searchDonations')}
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchInputTestId="searchInput"
          searchButtonTestId="searchButton"
          hasDropdowns={false}
        />

        <div className={styles.box}>
          <div className={styles.heading}>
            {t('donateForThe')} {organizationDetails.name}
          </div>

          <InputGroup className={styles.width100}>
            <Dropdown>
              <Dropdown.Toggle
                className={`${styles.colorPrimary} ${styles.dropdown}`}
                variant="success"
                data-testid="modeChangeBtn"
              >
                <span data-testid="changeCurrencyBtn">
                  {currencies[selectedCurrency]}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {currencies.map((currency, index) => (
                  <Dropdown.Item
                    key={currency}
                    data-testid={`currency${index}`}
                    onClick={() => setSelectedCurrency(index)}
                  >
                    {currency}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

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
              aria-describedby="donationAmountHelp"
            />
          </InputGroup>

          <div id="donationAmountHelp" className="text-muted form-text">
            {t('donationAmountDescription')}
          </div>

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
          ) : donations.length > 0 ? (
            donations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((donation) => {
                const cardProps: InterfaceDonationCardProps = {
                  name: donation.nameOfUser,
                  id: donation._id,
                  amount: donation.amount,
                  userId: donation.userId,
                  payPalId: donation.payPalId,
                  updatedAt: donation.updatedAt,
                };

                return (
                  <div key={donation._id} data-testid="donationCard">
                    <DonationCard {...cardProps} />
                  </div>
                );
              })
          ) : (
            <span>{t('nothingToShow')}</span>
          )}

          <PaginationList
            count={donations.length}
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

      <OrganizationSidebar />
    </div>
  );
}
