import DashBoardCardLoading from './DashboardCardLoading';
import React from 'react';
import { render, screen } from '@testing-library/react';
import styles from '../../style/app.module.css';
describe('Testing the DashBoardCardLoading component', () => {
  beforeEach(() => {
    render(<DashBoardCardLoading />);
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
});
