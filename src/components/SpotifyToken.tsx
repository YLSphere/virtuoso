import React, { createContext, useContext, useState } from 'react';

interface SpotifyTokenContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const SpotifyTokenContext = createContext<SpotifyTokenContextType | undefined>(undefined);

export const useSpotifyToken = (): SpotifyTokenContextType => {
  const context = useContext(SpotifyTokenContext);
  if (!context) {
    throw new Error('useSpotifyToken must be used within a SpotifyTokenProvider');
  }
  return context;
};

interface SpotifyTokenProviderProps {
  children: React.ReactNode;
}

export const SpotifyTokenProvider: React.FC<SpotifyTokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <SpotifyTokenContext.Provider value={{ token, setToken }}>
      {children}
    </SpotifyTokenContext.Provider>
  );
};