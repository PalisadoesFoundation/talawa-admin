import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgUpdate from './OrgUpdate';
import {
  MOCKS,
  MOCKS_ERROR_ORGLIST,
  MOCKS_ERROR_UPDATE_ORGLIST,
} from './OrgUpdateMocks';
import { debug } from 'jest-preview';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_UPDATE_ORGLIST, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
// Create a spy for a function
const mockErrorHandler = jest.fn();

describe('Testing Organization Update', () => {
  const props = {
    orgId: '123',
  };

  const formData = {
    name: 'Palisadoes Organization',
    description: 'This is a updated description',
    location: 'This is updated location',
    displayImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    isPublic: false,
    isVisible: true,
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component along with mock data', async () => {
    act(() => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>
      );
    });
    await wait();
    // Check labels are present or not
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Display Image:')).toBeInTheDocument();
    expect(screen.getByText('Public:')).toBeInTheDocument();
    expect(screen.getByText('Visible in Search:')).toBeInTheDocument();

    // Get the input fields, and btns
    const name = screen.getByPlaceholderText(/Enter Organization Name/i);
    const des = screen.getByPlaceholderText(/Description/i);
    const location = screen.getByPlaceholderText(/Location/i);
    const isPublic = screen.getByPlaceholderText(/Public/i);
    const isVisible = screen.getByPlaceholderText(/Visible/i);

    // Checking if form fields got updated according to the mock data
    expect(name).toHaveValue('Palisadoes');
    expect(des).toHaveValue('Equitable Access to STEM Education Jobs');
    expect(location).toHaveValue('Jamaica');
    expect(isPublic).toBeChecked();
    expect(isVisible).not.toBeChecked();
  });

  test('Should Update organization properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>
      );
    });

    await wait();

    // Get the input fields, and btns
    const name = screen.getByPlaceholderText(/Enter Organization Name/i);
    const des = screen.getByPlaceholderText(/Description/i);
    const location = screen.getByPlaceholderText(/Location/i);
    const displayImage = screen.getByPlaceholderText(/Display Image/i);
    const isPublic = screen.getByPlaceholderText(/Public/i);
    const isVisible = screen.getByPlaceholderText(/Visible/i);
    const saveChangesBtn = screen.getByText(/Save Changes/i);

    // Emptying the text fields to add updated data
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.change(des, { target: { value: '' } });
    fireEvent.change(location, { target: { value: '' } });

    // Mocking filling form behaviour
    userEvent.type(name, formData.name);
    userEvent.type(des, formData.description);
    userEvent.type(location, formData.location);
    userEvent.upload(displayImage, formData.displayImage);
    userEvent.click(isPublic);
    userEvent.click(isVisible);

    await wait();
    userEvent.click(saveChangesBtn);

    // Checking if the form got update accordingly
    expect(name).toHaveValue(formData.name);
    expect(des).toHaveValue(formData.description);
    expect(location).toHaveValue(formData.location);
    expect(displayImage).toBeTruthy();
    expect(isPublic).not.toBeChecked();
    expect(isVisible).toBeChecked();
  });

  test('Should render error occured text when Organization Could not be found', async () => {
    act(() => {
      render(
        <MockedProvider addTypename={false} mocks={MOCKS_ERROR_ORGLIST}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>
      );
    });
    await wait();
    expect(screen.getByText(/Mock Graphql Error/i));
  });

  test('Should show error occured toast when Organization could not be updated', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>
      );
    });

    await wait();

    // Get the input fields, and btns
    const name = screen.getByPlaceholderText(/Enter Organization Name/i);
    const des = screen.getByPlaceholderText(/Description/i);
    const location = screen.getByPlaceholderText(/Location/i);
    const displayImage = screen.getByPlaceholderText(/Display Image/i);
    const isPublic = screen.getByPlaceholderText(/Public/i);
    const isVisible = screen.getByPlaceholderText(/Visible/i);
    const saveChangesBtn = screen.getByText(/Save Changes/i);

    // Emptying the text fields to add updated data
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.change(des, { target: { value: '' } });
    fireEvent.change(location, { target: { value: '' } });

    // Mocking filling form behaviour
    userEvent.type(name, formData.name);
    userEvent.type(des, formData.description);
    userEvent.type(location, formData.location);
    userEvent.upload(displayImage, formData.displayImage);
    userEvent.click(isPublic);
    userEvent.click(isVisible);

    await wait();
    userEvent.click(saveChangesBtn);
  });
});
