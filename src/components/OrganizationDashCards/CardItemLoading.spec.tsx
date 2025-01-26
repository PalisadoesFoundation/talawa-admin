import CardItemLoading from './CardItemLoading';
import React from 'react';
import { render, screen } from '@testing-library/react';
import styles from '../../style/app.module.css';
describe('Test the CardItemLoading component', () => {
  test('Should render the component', () => {
    render(<CardItemLoading />);
    expect(screen.getByTestId('cardItemLoading')).toBeInTheDocument();
  });

  test('Should render all required child elements', () => {
    render(<CardItemLoading />);

    const cardItemLoading = screen.getByTestId('cardItemLoading');
    expect(cardItemLoading).toBeInTheDocument();

    const iconWrapper = cardItemLoading.querySelector(`.${styles.iconWrapper}`);
    expect(iconWrapper).toBeInTheDocument();

    const title = cardItemLoading.querySelector(`.${styles.title}`);
    expect(title).toBeInTheDocument();
  });
});
