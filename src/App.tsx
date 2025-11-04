import { useState, useEffect } from 'react';
import './App.css'
import NaviPanel from './components/NaviPanel/NaviPanel'
import Space from './components/Space/Space'
import LoginPage from './components/LoginPage/LoginPage'
import { getAuthData, createConnection, convertToWebSocketUrl, isConnectionActive } from './modules/loader'
import type { Card } from './types/space.types'

function App() {
  const [selectedSpaceCards, setSelectedSpaceCards] = useState<Card[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    // Check if there's already an active connection
    if (isConnectionActive()) {
      console.log('Connection already active, skipping new connection');
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      return;
    }

    // Check for saved authentication data
    const authData = getAuthData();
    if (authData) {
      // Try to connect automatically
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

    // Cleanup function called when component unmounts
    return () => {
      // Can add cleanup logic here if needed
      // But don't close connection as it may be used after navigation
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isCheckingAuth) {
    return (
      <div className="app">
        <div style={{ color: 'var(--button-text-color)', textAlign: 'center', padding: '20px' }}>
          Проверка подключения...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <Space createdCards={selectedSpaceCards}></Space>
      <NaviPanel onSpaceSelect={(cards: Card[]) => setSelectedSpaceCards(cards)}></NaviPanel>
    </div>
  )
}

export default App
