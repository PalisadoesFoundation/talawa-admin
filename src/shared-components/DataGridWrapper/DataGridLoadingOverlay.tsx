/**
 * DataGridLoadingOverlay Component
 *
 * A wrapper component that bridges MUI DataGrid's GridLoadingOverlayProps
 * and the LoadingState component interface.
 *
 * @component
 * @returns A loading overlay compatible with MUI DataGrid
 */
import React from 'react';
import LoadingState from '../LoadingState/LoadingState';

/**
 * Wrapper component to bridge GridLoadingOverlayProps and LoadingState.
 * This is used as the loadingOverlay slot in DataGrid to display a loading indicator.
 */
export const DataGridLoadingOverlay = (): JSX.Element => (
  <LoadingState isLoading={true} variant="inline" size="lg">
    <></>
  </LoadingState>
);
