import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import dayjs from 'dayjs';
import CategorySelector from './CategorySelector';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';

describe('CategorySelector', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockCategories: IActionItemCategoryInfo[] = [
    {
      id: 'cat1',
      name: 'Category One',
      description: 'First category description',
      isDisabled: false,
      createdAt: dayjs().subtract(3, 'day').toISOString(),
      organizationId: 'org1',
    },
    {
      id: 'cat2',
      name: 'Category Two',
      description: 'Second category description',
      isDisabled: false,
      createdAt: dayjs().subtract(2, 'day').toISOString(),
      organizationId: 'org1',
    },
    {
      id: 'cat3',
      name: 'Category Three',
      description: null,
      isDisabled: true,
      createdAt: dayjs().subtract(1, 'day').toISOString(),
      organizationId: 'org1',
    },
  ];

  const renderComponent = (
    categories: IActionItemCategoryInfo[] = mockCategories,
    selectedCategory: IActionItemCategoryInfo | null = null,
    onCategoryChange = vi.fn(),
  ): ReturnType<typeof render> => {
    return render(
      <I18nextProvider i18n={i18n}>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </I18nextProvider>,
    );
  };

  it('renders the category autocomplete', () => {
    renderComponent();

    expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
  });

  it('renders the action item category label', () => {
    renderComponent();

    expect(screen.getByLabelText(/action item category/i)).toBeInTheDocument();
  });

  it('shows selected category when provided', () => {
    renderComponent(mockCategories, mockCategories[0]);

    expect(screen.getByDisplayValue('Category One')).toBeInTheDocument();
  });

  it('shows empty input when no category selected', () => {
    renderComponent(mockCategories, null);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('');
  });

  it('opens dropdown and shows options when clicked', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Category One')).toBeInTheDocument();
      expect(screen.getByText('Category Two')).toBeInTheDocument();
      expect(screen.getByText('Category Three')).toBeInTheDocument();
    });
  });

  it('calls onCategoryChange when a category is selected', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, null, onCategoryChange);

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Category Two'));

    expect(onCategoryChange).toHaveBeenCalledWith(mockCategories[1]);
  });

  it('calls onCategoryChange with null when category is cleared', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, mockCategories[0], onCategoryChange);

    const user = userEvent.setup();
    const clearButton = screen.getByTitle('Clear');
    await user.click(clearButton);

    expect(onCategoryChange).toHaveBeenCalledWith(null);
  });

  it('filters options based on input text', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'Two');

    await waitFor(() => {
      expect(screen.getByText('Category Two')).toBeInTheDocument();
    });
  });

  it('renders with empty categories array', () => {
    renderComponent([]);

    expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows no options message when categories are empty and dropdown is opened', async () => {
    renderComponent([]);

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('No options')).toBeInTheDocument();
    });
  });

  it('has required attribute on input', () => {
    renderComponent();

    const input = screen.getByRole('combobox');
    expect(input).toBeRequired();
  });

  it('displays category name correctly in dropdown options', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Category One');
      expect(options[1]).toHaveTextContent('Category Two');
      expect(options[2]).toHaveTextContent('Category Three');
    });
  });

  it('allows keyboard interaction on combobox', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');

    // Focus and open dropdown via keyboard
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    // Verify dropdown is open
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});
