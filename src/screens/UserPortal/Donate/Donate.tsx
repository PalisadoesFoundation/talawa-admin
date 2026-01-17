/**
 * Donate Component
 *
 * This component allows users to make donations to an organization and view their previous donations.
 * It includes features such as currency selection, donation amount validation, and pagination for donation history.
 *
 * @component
 * @returns {JSX.Element} The Donate component.
 *
 * @remarks
 * - Uses `react-bootstrap` for UI components and `react-router-dom` for routing.
 * - Integrates with GraphQL queries and mutations to fetch and update donation data.
 * - Includes localization support using `react-i18next`.
 *
 * @requires
 * - `ORGANIZATION_DONATION_CONNECTION_LIST` (GraphQL Query): Fetches donation data for the organization.
 * - `ORGANIZATION_LIST` (GraphQL Query): Fetches organization details.
 * - `DONATE_TO_ORGANIZATION` (GraphQL Mutation): Handles donation submission.
 *
 * @example
 * ```tsx
 * <Donate />
 * ```
 *
 * @state
 * - `amount` (string): The donation amount entered by the user.
 * - `organizationDetails` (object): Details of the organization being donated to.
 * - `donations` (array): List of previous donations.
 * - `selectedCurrency` (number): Index of the selected currency.
 * - `page` (number): Current page for pagination.
 * - `rowsPerPage` (number): Number of rows per page for pagination.
 *
 * @methods
 * - `donateToOrg`: Validates and submits the donation.
 * - `handleChangePage`: Handles pagination page changes.
 * - `handleChangeRowsPerPage`: Handles changes in rows per page for pagination.
 *
 * @dependencies
 * - `DonationCard`: Displays individual donation details.
 * - `OrganizationSidebar`: Sidebar component for organization-related actions.
 * - `PaginationList`: Handles pagination controls.
 * - `SearchBar`: Search input for filtering donations.
 *
 * @accessibility
 * - Includes ARIA attributes and test IDs for better accessibility and testing.
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Button from 'react-bootstrap/Button';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import SendIcon from '@mui/icons-material/Send';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useTranslation } from 'react-i18next';

import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';
import styles from 'style/app-fixed.module.css';
import DonationCard from 'components/UserPortal/DonationCard/DonationCard';
import useLocalStorage from 'utils/useLocalstorage';
import { errorHandler } from 'utils/errorHandler';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import SearchBar from 'subComponents/SearchBar';
import {
  InterfaceDonation,
  InterfaceDonationCardProps,
} from 'types/Donation/interface';

export default function donate(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'donate' });

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

  const { data } = useQuery(ORGANIZATION_LIST, {
    variables: { id: organizationId },
  });

  const [donate] = useMutation(DONATE_TO_ORGANIZATION);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
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
      setOrganizationDetails(data.organizations[0]);
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
        <div className={`${styles.mainContainer50} me-4`}>
          <div className={styles.inputContainer}>
            <SearchBar
              placeholder={t('searchDonations')}
              onSearch={(value) => console.log(value)} // Replace with actual search handler
              inputTestId="searchByName"
              buttonTestId="searchButton"
            />
          </div>
          <div className={`${styles.box}`}>
            <div className={`${styles.heading}`}>
              {t('donateForThe')} {organizationDetails.name}
            </div>
            <div className={styles.donationInputContainer}>
              <InputGroup className={styles.width100}>
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
                  className={styles.inputField}
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
                className={`${styles.addButton} ${styles.donateBtn}`}
              >
                {t('donate')} <SendIcon />
              </Button>
            </div>
          </div>
          <div className={styles.sectionContainer}>
            <h5>{t('yourPreviousDonations')}</h5>
            <div
              className={`d-flex flex-column justify-content-between ${styles.sectionContent}`}
            >
              <div className={` ${styles.cardsContainer}`}>
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
