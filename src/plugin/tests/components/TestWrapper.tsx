import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

export default TestWrapper;
