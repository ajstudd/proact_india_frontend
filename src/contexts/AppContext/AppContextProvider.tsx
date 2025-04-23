import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';

export type AppContextType = {
  testState: string;
  setTestState: (value: string) => void;
  reset: () => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [testState, setTestState] = useState<string>('Test Data');

  const reset = () => {
    setTestState('Test Data');
  };

  return (
    <AppContext.Provider
      value={{
        testState,
        setTestState,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
