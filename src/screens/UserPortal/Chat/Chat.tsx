import React from 'react';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import styles from './Chat.module.css';
import getOrganizationId from 'utils/getOrganizationId';
import { useTranslation } from 'react-i18next';
import { Form, InputGroup } from 'react-bootstrap';
import { SearchOutlined } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ContactCard from 'components/UserPortal/ContactCard/ContactCard';
import ChatRoom from 'components/UserPortal/ChatRoom/ChatRoom';

interface InterfaceContactCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  setSelectedContactName: React.Dispatch<React.SetStateAction<string>>;
}

interface InterfaceChatRoomProps {
  selectedContact: string;
}

export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });
  const organizationId = getOrganizationId(location.href);

  const [selectedContact, setSelectedContact] = React.useState('');
  const [selectedContactName, setSelectedContactName] = React.useState('');
  const [contacts, setContacts] = React.useState([]);
  const [filterName, setFilterName] = React.useState('');

  const navbarProps = {
    currentPage: 'chat',
  };

  const chatRoomProps: InterfaceChatRoomProps = {
    selectedContact,
  };

  const {
    data: contactData,
    loading: contactLoading,
    refetch: contactRefetch,
  } = useQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      orgId: organizationId,
      firstName_contains: filterName,
    },
  });

  const handleSearch = (value: string): void => {
    setFilterName(value);

    contactRefetch({
      firstName_contains: value,
    });
  };
  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };
  const handleSearchByBtnClick = (): void => {
    const value =
      (document.getElementById('searchChats') as HTMLInputElement)?.value || '';
    handleSearch(value);
  };

  React.useEffect(() => {
    if (contactData) {
      setContacts(contactData.organizationsMemberConnection.edges);
    }
  }, [contactData]);

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <div className={styles.contactContainer}>
            <div
              className={`d-flex flex-column align-items-center justify-content-center ${styles.addChatContainer}`}
            >
              <h4 className={`d-flex w-100 justify-content-start`}>
                {t('contacts')}
              </h4>
              <InputGroup className={styles.maxWidth}>
                <Form.Control
                  placeholder={t('search')}
                  id="searchChats"
                  type="text"
                  className={`${styles.borderNone} ${styles.backgroundWhite}`}
                  onKeyUp={handleSearchByEnter}
                  data-testid="searchInput"
                />
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                  style={{ cursor: 'pointer' }}
                  onClick={handleSearchByBtnClick}
                  data-testid="searchBtn"
                >
                  <SearchOutlined className={`${styles.colorWhite}`} />
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className={styles.contactListContainer}>
              {contactLoading ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                contacts.map((contact: any, index: number) => {
                  const cardProps: InterfaceContactCardProps = {
                    id: contact._id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    image: contact.image,
                    setSelectedContactName,
                    selectedContact,
                    setSelectedContact,
                  };
                  return <ContactCard {...cardProps} key={index} />;
                })
              )}
            </div>
          </div>
          <div className={styles.chatContainer}>
            <div
              className={`d-flex flex-row justify-content-center align-items-center ${styles.chatHeadingContainer} ${styles.colorPrimary}`}
            >
              {selectedContact ? selectedContactName : t('chat')}
            </div>
            <ChatRoom {...chatRoomProps} />
          </div>
        </div>
      </div>
    </>
  );
}
