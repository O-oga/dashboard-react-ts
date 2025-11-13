import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css'
import NaviPanel from './components/NaviPanel/NaviPanel'
import Space from './components/Space/Space'
import LoginPage from './components/LoginPage/LoginPage'
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'
import { useAuthenticationVerification } from './modules/autenticationVerification'
import type { Card } from './types/space.types'
import { SpacesProvider } from './contexts/SpacesContext'

function App() {
  const { t } = useTranslation();
  const [currentSpaceCards, setCurrentSpaceCards] = useState<Card[]>([]);
  const { isAuthenticated, isCheckingAuth, setIsAuthenticated } = useAuthenticationVerification();

  // Memoize callback to ensure stable reference for NaviPanel
  const handleSpaceSelect = useCallback((cards: Card[]) => {
    setCurrentSpaceCards(cards);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isCheckingAuth) {
    return (
      <div className="app">
        <LanguageSwitcher />
        <div style={{ color: 'var(--button-text-color)', textAlign: 'center', padding: '20px' }}>
          {t('app.checkingConnection')}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LanguageSwitcher />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <SpacesProvider>
      <div className="app">
        <Space createdCards={currentSpaceCards}></Space>
        <NaviPanel onSpaceSelect={handleSpaceSelect}></NaviPanel>
      </div>
    </SpacesProvider>
  )
}

export default App
