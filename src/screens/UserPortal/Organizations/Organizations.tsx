import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import PaginationList from 'components/PaginationList/PaginationList';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './Organizations.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

const { getItem } = useLocalStorage();

/**
 * Interface for the props of OrganizationCard component.
 */
interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  admins: [];
  members: [];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    _id: string;
    user: {
      _id: string;
    };
  }[];
}

/**
 * Interface for the organization object.
 */
interface InterfaceOrganization {
  _id: string;
  name: string;
  image: string;
  description: string;
  admins: [];
  members: [];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    _id: string;
    user: {
      _id: string;
    };
  }[];
}

/**
 * Component to render the organizations of a user with pagination and filtering.
 *
 * @returns {JSX.Element} The Organizations component.
 */
export default function Organizations(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [organizations, setOrganizations] = useState<InterfaceOrganization[]>(
    [],
  );
  const [filterName, setFilterName] = useState('');
  const [mode, setMode] = useState(0);

  const modes = [
    t('allOrganizations'),
    t('joinedOrganizations'),
    t('createdOrganizations'),
  ];

  const userId: string | null = getItem('userId');

  const {
    data,
    refetch,
    loading: loadingOrganizations,
  } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { filter: filterName },
  });

  const { data: joinedOrganizationsData } = useQuery(
    USER_JOINED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  const { data: createdOrganizationsData } = useQuery(
    USER_CREATED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  /**
   * Handles window resizing to toggle the sidebar visibility.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer((prev) => !prev);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Handles page change for pagination.
   *
   * @param {React.MouseEvent<HTMLButtonElement> | null} _event - The event object.
   * @param {number} newPage - The new page number.
   */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  /**
   * Handles the change of rows per page for pagination.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - The event object.
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = event.target.value;
    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  /**
   * Handles the search input change to filter organizations.
   *
   * @param {string} value - The search query.
   */
  const handleSearch = (value: string): void => {
    setFilterName(value);
    refetch({
      filter: value,
    });
  };

  /**
   * Handles search when "Enter" is pressed in the search input.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event object.
   */
  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.target as HTMLInputElement;
      handleSearch(value);
    }
  };

  /**
   * Handles search when the search button is clicked.
   */
  const handleSearchByBtnClick = (): void => {
    const value =
      (document.getElementById('searchOrganizations') as HTMLInputElement)
        ?.value || '';
    handleSearch(value);
  };

  useEffect(() => {
    if (data) {
      const orgs = data.organizationsConnection.map(
        (organization: InterfaceOrganization) => {
          let membershipRequestStatus = '';
          if (
            organization.members.find(
              (member: { _id: string }) => member._id === userId,
            )
          )
            membershipRequestStatus = 'accepted';
          else if (
            organization.membershipRequests.find(
              (request: { user: { _id: string } }) =>
                request.user._id === userId,
            )
          )
            membershipRequestStatus = 'pending';
          return { ...organization, membershipRequestStatus };
        },
      );
      setOrganizations(orgs);
    }
  }, [data, userId]);

  useEffect(() => {
    if (mode === 0 && data) {
      const orgs = data.organizationsConnection.map(
        (organization: InterfaceOrganization) => {
          let membershipRequestStatus = '';
          if (
            organization.members.find(
              (member: { _id: string }) => member._id === userId,
            )
          )
            membershipRequestStatus = 'accepted';
          else if (
            organization.membershipRequests.find(
              (request: { user: { _id: string } }) =>
                request.user._id === userId,
            )
          )
            membershipRequestStatus = 'pending';
          return {
            ...organization,
            membershipRequestStatus,
            isJoined: membershipRequestStatus === 'accepted',
          };
        },
      );
      setOrganizations(orgs);
    } else if (mode === 1 && joinedOrganizationsData?.users?.length > 0) {
      const orgs =
        joinedOrganizationsData.users[0]?.user?.joinedOrganizations.map(
          (org: InterfaceOrganization) => ({
            ...org,
            membershipRequestStatus: 'accepted',
            isJoined: true,
          }),
        ) || [];
      setOrganizations(orgs);
    } else if (mode === 2 && createdOrganizationsData?.users?.length > 0) {
      const orgs =
        createdOrganizationsData.users[0]?.appUserProfile?.createdOrganizations.map(
          (org: InterfaceOrganization) => ({
            ...org,
            membershipRequestStatus: 'accepted',
            isJoined: true,
          }),
        ) || [];
      setOrganizations(orgs);
    }
  }, [mode, data, joinedOrganizationsData, createdOrganizationsData, userId]);

  return <>{/* JSX Structure Here */}</>;
}
