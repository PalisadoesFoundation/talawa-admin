import React from 'react';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import styles from './Donate.module.css';
import SendIcon from '@mui/icons-material/Send';
import getOrganizationId from 'utils/getOrganizationId';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DonationCard from 'components/UserPortal/DonationCard/DonationCard';
import { useTranslation } from 'react-i18next';

interface InterfaceDonationCardProps {
  id: string;
  name: string;
  amount: string;
  userId: string;
  payPalId: string;
}

export default function donate(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

  const organizationId = getOrganizationId(location.href);
  const [organizationDetails, setOrganizationDetails]: any = React.useState({});
  const [donations, setDonations] = React.useState([]);
  const [selectedCurrency, setSelectedCurrency] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const currencies = ['USD', 'INR', 'EUR'];

  const { data: data2, loading } = useQuery(
    ORGANIZATION_DONATION_CONNECTION_LIST,
    {
      variables: { orgId: organizationId },
    }
  );

  const { data } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { id: organizationId },
  });

  const navbarProps = {
    currentPage: 'donate',
  };

  /* istanbul ignore next */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  React.useEffect(() => {
    if (data) {
      setOrganizationDetails(data.organizationsConnection[0]);
    }
  }, [data]);

  React.useEffect(() => {
    if (data2) {
      setDonations(data2.getDonationByOrgIdConnection);
    }
  }, [data2]);

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <div className={`${styles.box}`}>
            <h4>Donate to {organizationDetails.name}</h4>
            <div className={styles.donationInputContainer}>
              <InputGroup className={styles.maxWidth}>
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                >
                  Amount
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className={styles.borderNone}
                  data-testid="searchInput"
                />
                <Dropdown drop="down-centered">
                  <Dropdown.Toggle
                    className={`${styles.colorPrimary} ${styles.borderNone}`}
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
              </InputGroup>
            </div>
            <div className={styles.donateActions}>
              <Button data-testid={'donateBtn'}>
                Donate <SendIcon />
              </Button>
            </div>
          </div>
          <div className={styles.donationsContainer}>
            <h5>Your Previous Donations</h5>
            <div
              className={`d-flex flex-column justify-content-between ${styles.content}`}
            >
              <div
                className={`d-flex flex-column ${styles.gap} ${styles.paddingY}`}
              >
                {loading ? (
                  <div className={`d-flex flex-row justify-content-center`}>
                    <HourglassBottomIcon /> <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    {donations && donations.length > 0 ? (
                      (rowsPerPage > 0
                        ? donations.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : /* istanbul ignore next */
                          donations
                      ).map((donation: any, index) => {
                        const cardProps: InterfaceDonationCardProps = {
                          name: donation.nameOfUser,
                          id: donation._id,
                          amount: donation.amount,
                          userId: donation.userId,
                          payPalId: donation.payPalId,
                        };
                        return <DonationCard key={index} {...cardProps} />;
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
                      count={
                        /* istanbul ignore next */
                        donations ? donations.length : 0
                      }
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
