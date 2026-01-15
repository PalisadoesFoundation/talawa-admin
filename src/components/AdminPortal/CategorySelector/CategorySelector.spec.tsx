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
      expect(screen.queryByText('Category One')).not.toBeInTheDocument();
      expect(screen.queryByText('Category Three')).not.toBeInTheDocument();
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

    // Select option via Enter key
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Category One')).toBeInTheDocument();
    });
  });

  it('allows keyboard selection with Enter key', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, null, onCategoryChange);

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onCategoryChange).toHaveBeenCalledWith(mockCategories[1]);
  });

  it('displays disabled category in dropdown', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    // Verify disabled category (Category Three with isDisabled: true) is rendered in dropdown
    await waitFor(() => {
      expect(screen.getByText('Category Three')).toBeInTheDocument();
    });
  });

  it('allows selecting disabled category', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, null, onCategoryChange);

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Category Three')).toBeInTheDocument();
    });

    // Click the disabled category - component doesn't filter disabled categories
    await user.click(screen.getByText('Category Three'));

    expect(onCategoryChange).toHaveBeenCalledWith(mockCategories[2]);
  });

  it('closes dropdown with Escape key', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    // Verify dropdown is open
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Press Escape to close
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('navigates options with ArrowUp and ArrowDown keys', async () => {
    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Navigate down twice then up once
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');

    // Verify we can still select with Enter
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Category One')).toBeInTheDocument();
    });
  });

  it('does not call onCategoryChange when dropdown is closed without selection', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, null, onCategoryChange);

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Close without selecting
    await user.keyboard('{Escape}');

    expect(onCategoryChange).not.toHaveBeenCalled();
  });

  it('maintains selected value when reopening dropdown', async () => {
    const onCategoryChange = vi.fn();
    renderComponent(mockCategories, mockCategories[0], onCategoryChange);

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');

    // Open dropdown
    await user.click(input);
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Close without changing
    await user.keyboard('{Escape}');

    // Value should still be displayed
    expect(screen.getByDisplayValue('Category One')).toBeInTheDocument();
  });

  it('uses correct test id for integration testing', () => {
    renderComponent();

    const autocomplete = screen.getByTestId('categorySelect');
    expect(autocomplete).toBeInTheDocument();
    expect(autocomplete).toHaveAttribute('data-cy', 'categorySelect');
  });
});
