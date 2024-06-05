import React, { useState } from 'react';
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
import Nav from 'react-bootstrap/Nav';
import MemberOrganization from 'components/MemberOrganization/MemberOrganization';
import { Tab } from 'react-bootstrap';
import OrgMemberDetail from 'components/OrgMemberDetail/OrgMemberDetails';

type MemberDetailProps = {
  id?: string;
};

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });

  const location = useLocation();
  const { getItem } = useLocalStorage();
  const currentUrl = location.state?.id || getItem('id') || id;

  const superAdmin = getItem('SuperAdmin');
  superAdmin
    ? (document.title = t('title'))
    : (document.title = t('titleAdmin'));

  const { data: user, loading: loading } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl },
  });
  const userData = user?.user;

  const [activeTab, setActiveTab] = useState('overview');

  const handleSelect = (selectedKey: string | null): void => {
    if (selectedKey) {
      setActiveTab(selectedKey);
    }
  };

  const topNavButtons = [
    {
      name: 'overview',
      icon: <DashboardOutlinedIcon />,
      component: <OrgMemberDetail id={userData?.user?._id} />,
    },
    {
      name: 'organizations',
      icon: <BusinessOutlinedIcon />,
      component: (
        <MemberOrganization
          {...{
            userId: userData?.user?._id,
          }}
        />
      ),
    },
    {
      name: 'events',
      icon: <InsertInvitationOutlinedIcon />,
      component: <></>,
    },
    { name: 'tags', icon: <LocalOfferOutlinedIcon />, component: <></> },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Tab.Container
          id="member-detail-tab-container"
          defaultActiveKey="overview"
          onSelect={handleSelect}
        >
          <Nav
            variant="pills"
            className={`${styles.topNav} ${
              activeTab === 'overview' ? styles.navOverview : styles.navOther
            }`}
            data-testid="memberDetailTabNav"
          >
            {topNavButtons.map((button) => (
              <Nav.Item key={button.name}>
                <Nav.Link eventKey={button.name} className={styles.topNavBtn}>
                  {button.icon} {t(button.name)}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {topNavButtons.map((button) => (
              <Tab.Pane
                eventKey={button.name}
                key={button.name}
                className={`${styles.tabSection} ${
                  activeTab === 'overview' ? '' : styles.othertabSection
                }`}
              >
                {button.component}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
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
