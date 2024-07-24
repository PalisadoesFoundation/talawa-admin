import React from 'react';
// import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
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
/**
 * The `chat` component provides a user interface for interacting with contacts and chat rooms within an organization.
 * It features a contact list with search functionality and displays the chat room for the selected contact.
 * The component uses GraphQL to fetch and manage contact data, and React state to handle user interactions.
 *
 * ## Features:
 * - **Search Contacts:** Allows users to search for contacts by their first name.
 * - **Contact List:** Displays a list of contacts with their details and a profile image.
 * - **Chat Room:** Shows the chat room for the selected contact.
 *
 * ## GraphQL Queries:
 * - `ORGANIZATIONS_MEMBER_CONNECTION_LIST`: Fetches a list of members within an organization, with optional filtering based on the first name.
 *
 * ## Event Handlers:
 * - `handleSearch`: Updates the filterName state and refetches the contact data based on the search query.
 * - `handleSearchByEnter`: Handles search input when the Enter key is pressed.
 * - `handleSearchByBtnClick`: Handles search input when the search button is clicked.
 *
 * ## Rendering:
 * - Displays a search input field and a search button for filtering contacts.
 * - Shows a list of contacts with their details and profile images.
 * - Renders a chat room component for the selected contact.
 * - Displays a loading indicator while contact data is being fetched.
 *
 * @returns  The rendered `chat` component.
 */
export default function chat(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChat',
  });
  const { t: tCommon } = useTranslation('common');
  const organizationId = getOrganizationId(location.href);

  const [selectedContact, setSelectedContact] = React.useState('');
  const [selectedContactName, setSelectedContactName] = React.useState('');
  const [contacts, setContacts] = React.useState([]);
  const [filterName, setFilterName] = React.useState('');

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
  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
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
      {/* <OrganizationNavbar {...navbarProps} /> */}
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
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
                  placeholder={tCommon('search')}
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
                contacts.map(
                  (contact: InterfaceContactCardProps, index: number) => {
                    const cardProps: InterfaceContactCardProps = {
                      id: contact.id,
                      firstName: contact.firstName,
                      lastName: contact.lastName,
                      email: contact.email,
                      image: contact.image,
                      setSelectedContactName,
                      selectedContact,
                      setSelectedContact,
                    };
                    return <ContactCard {...cardProps} key={index} />;
                  },
                )
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
