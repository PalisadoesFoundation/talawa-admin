import React, { createContext, useContext, ReactNode } from 'react';

interface OrganizationContextType {
  organizationId: string | undefined;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

interface OrganizationProviderProps {
  children: ReactNode;
  organizationId: string | undefined;
}

export function OrganizationProvider({
  children,
  organizationId,
}: OrganizationProviderProps): JSX.Element {
  return (
    <OrganizationContext.Provider value={{ organizationId }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    );
  }
  return context;
}
