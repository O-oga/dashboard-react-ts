import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css'
import NaviPanel from './components/NaviPanel/NaviPanel'
import Space from './components/Space/Space'
import LoginPage from './components/LoginPage/LoginPage'
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'
import { useAuthenticationVerification } from './modules/autenticationVerification'
import type { Card } from './types/space.types'

function App() {
  const { t } = useTranslation();
  const [currentSpaceCards, setCurrentSpaceCards] = useState<Card[]>([]);
  const { isAuthenticated, isCheckingAuth, setIsAuthenticated } = useAuthenticationVerification();

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
    <div className="app">
      <Space createdCards={currentSpaceCards}></Space>
      <NaviPanel onSpaceSelect={(cards: Card[]) => setCurrentSpaceCards(cards)}></NaviPanel>
    </div>
  )
}

export default App
