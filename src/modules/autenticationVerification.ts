import { useState, useEffect } from 'react';
import { getAuthData, createConnection, convertToWebSocketUrl, isConnectionActive } from '@/modules/loader';

export const useAuthenticationVerification = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    if (isConnectionActive()) {
      console.log('Connection already active, skipping new connection');
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      return;
    }

    const authData = getAuthData();
    if (authData) {
      const wsUrl = convertToWebSocketUrl(authData.url);
      createConnection(wsUrl, authData.token)
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Auto-connection failed:', error);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsCheckingAuth(false);
        });
    } else {
      setIsCheckingAuth(false);
    }

    return () => {
      // may be used after navigation
    };
  }, []);

  return { isAuthenticated, isCheckingAuth, setIsAuthenticated };
};

