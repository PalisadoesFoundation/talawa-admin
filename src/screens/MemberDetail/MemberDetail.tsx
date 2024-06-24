import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MemberOrganization from 'components/MemberOrganization/MemberOrganization';
import { Button } from 'react-bootstrap';
import OrgMemberDetail from 'components/OrgMemberDetail/OrgMemberDetails';

type MemberDetailProps = {
  id?: string;
};

type TabOptions = 'overview' | 'organizations' | 'events' | 'tags';

const topNavButtons: {
  value: TabOptions;
  icon: JSX.Element;
}[] = [
  {
    value: 'overview',
    icon: <DashboardOutlinedIcon />,
  },
  {
    value: 'organizations',
    icon: <BusinessOutlinedIcon />,
  },
  {
    value: 'events',
    icon: <InsertInvitationOutlinedIcon />,
  },
  {
    value: 'tags',
    icon: <LocalOfferOutlinedIcon />,
  },
];

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });

  const location = useLocation();
  const { getItem } = useLocalStorage();
  const currentUrl = location.state?.id || getItem('id') || id;

  useEffect(() => {
    const superAdmin = getItem('SuperAdmin');
    superAdmin
      ? (document.title = t('title_superadmin'))
      : (document.title = t('title'));
  }, [getItem, t]);

  const { data: user, loading: loading } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl },
  });
  const userData = user?.user;

  const [activeTab, setActiveTab] = useState<TabOptions>('overview');

  const renderButton = ({
    value,
    icon,
  }: {
    value: TabOptions;
    icon: React.ReactNode;
  }): JSX.Element => {
    const selected = activeTab === value;
    const translatedText = t(value);
    const className = selected
      ? `${styles.topNavBtn} ${styles.topNavBtn_selected}`
      : `${styles.topNavBtn} ${styles.topNavBtn_notSelected}`;
    const props = {
      className,
      key: value,
      onClick: () => setActiveTab(value),
      'data-testid': `${value}Btn`,
    };

    return (
      <Button {...props}>
        {icon}
        {translatedText}
      </Button>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div data-testid="container">
        <div
          className={`${styles.topNav} ${
            (activeTab === 'overview' && styles.navOverview) || styles.navOther
          }`}
        >
          {topNavButtons.map(renderButton)}
        </div>

        {(() => {
          switch (activeTab) {
            case 'overview':
              return (
                <div
                  data-testid="orgmemberdetailTab"
                  className={`${styles.tabSection}`}
                >
                  <OrgMemberDetail id={userData?.user?._id} />
                </div>
              );
            case 'organizations':
              return (
                <div
                  data-testid="memberorganizationTab"
                  className={`${styles.tabSection} ${styles.othertabSection}`}
                >
                  <MemberOrganization
                    {...{
                      userId: userData?.user?._id,
                    }}
                  />
                </div>
              );
            case 'events':
              return (
                <div
                  data-testid="eventsTab"
                  className={`${styles.tabSection} ${styles.othertabSection}`}
                ></div>
              );
            case 'tags':
              return (
                <div
                  data-testid="tagsTab"
                  className={`${styles.tabSection} ${styles.othertabSection}`}
                ></div>
              );
          }
        })()}
      </div>
    </LocalizationProvider>
  );
};
export const prettyDate = (param: string): string => {
  const date = new Date(param);
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
export const getLanguageName = (code: string): string => {
  let language = 'Unavailable';
  languages.map((data) => {
    if (data.code == code) {
      language = data.name;
    }
  });
  return language;
};
export default MemberDetail;
