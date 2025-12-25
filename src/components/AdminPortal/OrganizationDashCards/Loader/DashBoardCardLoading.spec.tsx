import DashBoardCardLoading from './DashboardCardLoading';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import styles from 'style/app-fixed.module.css';
describe('Testing the DashBoardCardLoading component', () => {
  beforeEach(() => {
    render(<DashBoardCardLoading />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render the component', () => {
    expect(screen.getByTestId('Card')).toBeInTheDocument();
  });

  test('should render every children elements of the component', () => {
    const Card = screen.queryByTestId('Card');
    const CardBody = Card?.querySelector(`.${styles.cardBody}`);
    expect(CardBody).toBeInTheDocument();
    const iconWrapper = Card?.querySelector(`.${styles.iconWrapper}`);
    expect(iconWrapper).toBeInTheDocument();
    const themeOverlay = Card?.querySelector(`.${styles.themeOverlay}`);
    expect(themeOverlay).toBeInTheDocument();
    const textWrapper = Card?.querySelector(`.${styles.textWrapper}`);
    expect(textWrapper).toBeInTheDocument();
    const primaryText = Card?.querySelector(`.${styles.primaryText}`);
    expect(primaryText).toBeInTheDocument();
    const secondaryText = Card?.querySelector(`.${styles.secondaryText}`);
    expect(secondaryText).toBeInTheDocument();
  });

  test('should apply height utility classes to text placeholders', () => {
    const Card = screen.queryByTestId('Card');
    const primaryText = Card?.querySelector(`.${styles.primaryText}`);
    const secondaryText = Card?.querySelector(`.${styles.secondaryText}`);

    expect(primaryText).toHaveClass(styles['h-1-75rem']);
    expect(secondaryText).toHaveClass(styles['h-1-25rem']);
  });
});
