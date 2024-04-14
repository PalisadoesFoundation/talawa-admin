import React from 'react';
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
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import PaginationList from 'components/PaginationList/PaginationList';

export interface InterfaceDonationCardProps {
  id: string;
  name: string;
  amount: string;
  userId: string;
  payPalId: string;
  updatedAt: string;
}

export default function donate(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'donate',
  });

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const userName = getItem('name');

  const { orgId: organizationId } = useParams();
  const [amount, setAmount] = React.useState<string>('');
  const [organizationDetails, setOrganizationDetails]: any = React.useState({});
  const [donations, setDonations] = React.useState([]);
  const [selectedCurrency, setSelectedCurrency] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const currencies = ['USD', 'INR', 'EUR'];

  const {
    data: data2,
    loading,
    refetch,
  } = useQuery(ORGANIZATION_DONATION_CONNECTION_LIST, {
    variables: { orgId: organizationId },
  });

  const { data } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { id: organizationId },
  });

  const [donate] = useMutation(DONATE_TO_ORGANIZATION);

  const navbarProps = {
    currentPage: 'donate',
  };

  /* istanbul ignore next */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const donateToOrg = (): void => {
    try {
      donate({
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
      toast.success(t(`success`));
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={` ${styles.mainContainer}`}>
          <h1>{t(`donations`)}</h1>
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
                  <div className={`d-flex flex-row justify-content-center`}>
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
                        : /* istanbul ignore next */
                          donations
                      ).map((donation: any, index) => {
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
