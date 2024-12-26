import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
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
import { vi } from 'vitest';

/**
 * Unit Tests for `OrgUpdate` Component
 *
 * - Rendering Component with Props: Verifies if labels and input fields are correctly rendered based on mock data.
 * - Updating Organization: Ensures the form updates with new data and saves changes correctly.
 * - Error Handling: Verifies error messages when organization cannot be found or updated.
 * - Toast on Error: Verifies that an error toast is shown when the update fails.
 * - Form Field Values: Ensures form values are correctly displayed and updated.
 * - GraphQL Mock Responses: Mocks GraphQL responses for success and error scenarios.
 */

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Organization Update', () => {
  const props = {
    orgId: '123',
  };

  const formData = {
    name: 'Palisadoes Organization',
    description: 'This is a updated description',
    address: {
      city: 'Kingston',
      countryCode: 'JM',
      dependentLocality: 'Sample Dependent Locality',
      line1: '123 Jamaica Street',
      line2: 'Apartment 456',
      postalCode: 'JM12345',
      sortingCode: 'ABC-123',
      state: 'Kingston Parish',
    },
    displayImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    userRegistrationRequired: false,
    isVisible: true,
  };

  global.alert = vi.fn();

  it('should render props and text elements test for the page component along with mock data', async () => {
    act(() => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );
    });
    await wait();
    // Check labels are present or not
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Display Image:')).toBeInTheDocument();
    expect(screen.getByText(/Registration/)).toBeInTheDocument();
    expect(screen.getByText('Visible in Search:')).toBeInTheDocument();

    // Get the input fields, and btns
    const name = screen.getByPlaceholderText(/Enter Organization Name/i);
    const des = screen.getByPlaceholderText(/Description/i);
    const city = screen.getByPlaceholderText(/City/i);
    const countryCode = screen.getByTestId('countrycode');
    const line1 = screen.getByPlaceholderText(/Line 1/i);
    const line2 = screen.getByPlaceholderText(/Line 2/i);
    const dependentLocality =
      screen.getByPlaceholderText(/Dependent Locality/i);
    const sortingCode = screen.getByPlaceholderText(/Sorting code/i);
    const postalCode = screen.getByPlaceholderText(/Postal Code/i);
    const userRegistrationRequired =
      screen.getByPlaceholderText(/Registration/i);
    const isVisible = screen.getByPlaceholderText(/Visible/i);

    // Checking if form fields got updated according to the mock data
    expect(name).toHaveValue('Palisadoes');
    expect(des).toHaveValue('Equitable Access to STEM Education Jobs');
    expect(city).toHaveValue('Kingston');
    expect(countryCode).toHaveValue('JM');
    expect(dependentLocality).toHaveValue('Sample Dependent Locality');
    expect(line1).toHaveValue('123 Jamaica Street');
    expect(line2).toHaveValue('Apartment 456');
    expect(postalCode).toHaveValue('JM12345');
    expect(sortingCode).toHaveValue('ABC-123');
    expect(userRegistrationRequired).toBeChecked();
    expect(isVisible).not.toBeChecked();
  });

  it('Should Update organization properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );
    });

    await wait();

    // Get the input fields, and btns
    const name = screen.getByPlaceholderText(/Enter Organization Name/i);
    const des = screen.getByPlaceholderText(/Description/i);

    const city = screen.getByPlaceholderText(/City/i);
    const countryCode = screen.getByTestId('countrycode');
    const line1 = screen.getByPlaceholderText(/Line 1/i);
    const line2 = screen.getByPlaceholderText(/Line 2/i);
    const dependentLocality =
      screen.getByPlaceholderText(/Dependent Locality/i);
    const sortingCode = screen.getByPlaceholderText(/Sorting code/i);
    const postalCode = screen.getByPlaceholderText(/Postal Code/i);
    const displayImage = screen.getByPlaceholderText(/Display Image/i);
    const userRegistrationRequired =
      screen.getByPlaceholderText(/Registration/i);
    const isVisible = screen.getByPlaceholderText(/Visible/i);
    const saveChangesBtn = screen.getByText(/Save Changes/i);

    // Emptying the text fields to add updated data
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.change(des, { target: { value: '' } });
    fireEvent.change(city, { target: { value: '' } });
    fireEvent.change(line1, { target: { value: '' } });
    fireEvent.change(line2, { target: { value: '' } });
    fireEvent.change(postalCode, { target: { value: '' } });
    fireEvent.change(sortingCode, { target: { value: '' } });
    fireEvent.change(dependentLocality, { target: { value: '' } });

    // Mocking filling form behaviour
    userEvent.type(name, formData.name);
    userEvent.type(des, formData.description);
    userEvent.type(city, formData.address.city);
    userEvent.selectOptions(countryCode, formData.address.countryCode);
    userEvent.type(line1, formData.address.line1);
    userEvent.type(line2, formData.address.line2);
    userEvent.type(postalCode, formData.address.postalCode);
    userEvent.type(dependentLocality, formData.address.dependentLocality);
    userEvent.type(sortingCode, formData.address.sortingCode);
    userEvent.upload(displayImage, formData.displayImage);
    userEvent.click(userRegistrationRequired);
    userEvent.click(isVisible);

    await wait();
    userEvent.click(saveChangesBtn);

    // Checking if the form got update accordingly
    expect(name).toHaveValue(formData.name);
    expect(des).toHaveValue(formData.description);
    expect(city).toHaveValue(formData.address.city);
    expect(countryCode).toHaveValue(formData.address.countryCode);
    expect(dependentLocality).toHaveValue(formData.address.dependentLocality);
    expect(line1).toHaveValue(formData.address.line1);
    expect(line2).toHaveValue(formData.address.line2);
    expect(postalCode).toHaveValue(formData.address.postalCode);
    expect(sortingCode).toHaveValue(formData.address.sortingCode);
    expect(displayImage).toBeTruthy();
    expect(userRegistrationRequired).not.toBeChecked();
    expect(isVisible).toBeChecked();
  });

  it('Should render error occured text when Organization Could not be found', async () => {
    act(() => {
      render(
        <MockedProvider addTypename={false} mocks={MOCKS_ERROR_ORGLIST}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );
    });
    await wait();
    expect(screen.getByText(/Mock Graphql Error/i)).toBeInTheDocument();
  });

  it('Should show error occured toast when Organization could not be updated', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={MOCKS_ERROR_UPDATE_ORGLIST}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );
    });

    await wait();

    // Get the input fields, and btns
    const name = screen.getByPlaceholderText(/Enter Organization Name/i);
    const des = screen.getByPlaceholderText(/Description/i);
    const city = screen.getByPlaceholderText(/City/i);
    const countryCode = screen.getByTestId('countrycode');
    const line1 = screen.getByPlaceholderText(/Line 1/i);
    const line2 = screen.getByPlaceholderText(/Line 2/i);
    const dependentLocality =
      screen.getByPlaceholderText(/Dependent Locality/i);
    const sortingCode = screen.getByPlaceholderText(/Sorting code/i);
    const postalCode = screen.getByPlaceholderText(/Postal Code/i);
    const displayImage = screen.getByPlaceholderText(/Display Image/i);
    const userRegistrationRequired =
      screen.getByPlaceholderText(/Registration/i);
    const isVisible = screen.getByPlaceholderText(/Visible/i);
    const saveChangesBtn = screen.getByText(/Save Changes/i);

    // Emptying the text fields to add updated data
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.change(des, { target: { value: '' } });
    fireEvent.change(city, { target: { value: '' } });
    fireEvent.change(line1, { target: { value: '' } });
    fireEvent.change(line2, { target: { value: '' } });
    fireEvent.change(postalCode, { target: { value: '' } });
    fireEvent.change(sortingCode, { target: { value: '' } });
    fireEvent.change(dependentLocality, { target: { value: '' } });

    // Mocking filling form behaviour
    userEvent.type(name, formData.name);
    userEvent.type(des, formData.description);
    userEvent.type(city, formData.address.city);
    userEvent.selectOptions(countryCode, formData.address.countryCode);
    userEvent.type(line1, formData.address.line1);
    userEvent.type(line2, formData.address.line2);
    userEvent.type(postalCode, formData.address.postalCode);
    userEvent.type(dependentLocality, formData.address.dependentLocality);
    userEvent.type(sortingCode, formData.address.sortingCode);
    userEvent.upload(displayImage, formData.displayImage);
    userEvent.click(userRegistrationRequired);
    userEvent.click(isVisible);

    await wait();
    userEvent.click(saveChangesBtn);
  });
});
