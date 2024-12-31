import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import { Search } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useTranslation } from 'react-i18next';

import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';
import styles from './Donate.module.css';
import DonationCard from 'components/UserPortal/DonationCard/DonationCard';
import useLocalStorage from 'utils/useLocalstorage';
import { errorHandler } from 'utils/errorHandler';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import PaginationList from 'components/PaginationList/PaginationList';

export interface InterfaceDonationCardProps {
  id: string;
  name: string;
  amount: string;
  userId: string;
  payPalId: string;
  updatedAt: string;
}

interface InterfaceDonation {
  _id: string;
  nameOfUser: string;
  amount: string;
  userId: string;
  payPalId: string;
  updatedAt: string;
}

/**
 * `donate` component allows users to make donations to an organization and view their previous donations.
 *
 * This component fetches donation-related data using GraphQL queries and allows users to make donations
 * using a mutation. It supports currency selection, donation amount input, and displays a paginated list
 * of previous donations.
 *
 * It includes:
 * - An input field for searching donations.
 * - A dropdown to select currency.
 * - An input field for entering donation amount.
 * - A button to submit the donation.
 * - A list of previous donations displayed in a paginated format.
 * - An organization sidebar for navigation.
 *
 * ### GraphQL Queries
 * - `ORGANIZATION_DONATION_CONNECTION_LIST`: Fetches the list of donations for the organization.
 * - `USER_ORGANIZATION_CONNECTION`: Fetches organization details.
 *
 * ### GraphQL Mutations
 * - `DONATE_TO_ORGANIZATION`: Performs the donation action.
 *
 * @returns The rendered component.
 */
export default function donate(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'donate',
  });

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const userName = getItem('name');

  const { orgId: organizationId } = useParams();
  const [amount, setAmount] = useState<string>('');
  const [organizationDetails, setOrganizationDetails] = useState<{
    name: string;
  }>({ name: '' });
  const [donations, setDonations] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const currencies = ['USD', 'INR', 'EUR'];

  const {
    data: donationData,
    loading,
    refetch,
  } = useQuery(ORGANIZATION_DONATION_CONNECTION_LIST, {
    variables: { orgId: organizationId },
  });

  const { data } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { id: organizationId },
  });

  const [donate] = useMutation(DONATE_TO_ORGANIZATION);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  useEffect(() => {
    if (data) {
      setOrganizationDetails(data.organizationsConnection[0]);
    }
  }, [data]);

  useEffect(() => {
    if (donationData) {
      setDonations(donationData.getDonationByOrgIdConnection);
    }
  }, [donationData]);

  const donateToOrg = async (): Promise<void> => {
    // check if the amount is non empty and is a number
    if (amount === '' || Number.isNaN(Number(amount))) {
      toast.error(t(`invalidAmount`));
      return;
    }

    // check if the amount is non negative and within the range
    const minDonation = 1;
    const maxDonation = 10000000;
    if (
      Number(amount) <= 0 ||
      Number(amount) < minDonation ||
      Number(amount) > maxDonation
    ) {
      toast.error(
        t(`donationOutOfRange`, { min: minDonation, max: maxDonation }),
      );
      return;
    }

    const formattedAmount = Number(amount.trim());

    try {
      await donate({
        variables: {
          userId,
          createDonationOrgId2: organizationId,
          payPalId: 'paypalId',
          nameOfUser: userName,
          amount: formattedAmount,
          nameOfOrg: organizationDetails.name,
        },
      });
      refetch();
      toast.success(t(`success`) as string);
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      <div className={`d-flex flex-row mt-4`}>
        <div className={`${styles.mainContainer} me-4`}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchUsers"
                className="bg-white"
                placeholder={t('searchDonations')}
                data-testid="searchByName"
                autoComplete="off"
                required
                // onKeyUp={handleSearchByEnter}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                data-testid="searchButton"
                // onClick={handleSearchByBtnClick}
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className={`${styles.box}`}>
            <div className={`${styles.heading}`}>
              {t('donateForThe')} {organizationDetails.name}
            </div>
            <div className={styles.donationInputContainer}>
              <InputGroup className={styles.maxWidth}>
                <Dropdown drop="down-centered">
                  <Dropdown.Toggle
                    className={`${styles.colorPrimary} ${styles.dropdown}`}
                    variant="success"
                    id="dropdown-basic"
                    data-testid={`modeChangeBtn`}
                  >
                    <span data-testid={`changeCurrencyBtn`}>
                      {currencies[selectedCurrency]}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {currencies.map((currency, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={(): void => setSelectedCurrency(index)}
                          data-testid={`currency${index}`}
                        >
                          {currency}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  type="text"
                  className={styles.inputArea}
                  data-testid="donationAmount"
                  placeholder={t('amount')}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </InputGroup>
            </div>
            <Form.Text className="text-muted">
              {t('donationAmountDescription')}
            </Form.Text>
            <div className={styles.donateActions}>
              <Button
                size="sm"
                data-testid={'donateBtn'}
                onClick={donateToOrg}
                className={`${styles.donateBtn}`}
              >
                {t('donate')} <SendIcon />
              </Button>
            </div>
          </div>
          <div className={styles.donationsContainer}>
            <h5>{t('yourPreviousDonations')}</h5>
            <div
              className={`d-flex flex-column justify-content-between ${styles.content}`}
            >
              <div className={` ${styles.donationCardsContainer}`}>
                {loading ? (
                  <div
                    className={`d-flex flex-row justify-content-center`}
                    data-testid="loading-state"
                  >
                    <HourglassBottomIcon /> <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    {donations && donations.length > 0 ? (
                      (rowsPerPage > 0
                        ? donations.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                        : donations
                      ).map((donation: InterfaceDonation, index) => {
                        const cardProps: InterfaceDonationCardProps = {
                          name: donation.nameOfUser,
                          id: donation._id,
                          amount: donation.amount,
                          userId: donation.userId,
                          payPalId: donation.payPalId,
                          updatedAt: donation.updatedAt,
                        };
                        return (
                          <div key={index} data-testid="donationCard">
                            <DonationCard {...cardProps} />
                          </div>
                        );
                      })
                    ) : (
                      <span>{t('nothingToShow')}</span>
                    )}
                  </>
                )}
              </div>
              <table>
                <tbody>
                  <tr>
                    <PaginationList
                      count={donations ? donations.length : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <OrganizationSidebar />
      </div>
    </>
  );
}
