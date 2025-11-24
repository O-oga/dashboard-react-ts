import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css'
import NaviPanel from './components/NaviPanel/NaviPanel'
import SpaceComponent from './components/Space/Space'
import LoginPage from './components/LoginPage/LoginPage'
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'
import { useAuthenticationVerification } from './modules/autenticationVerification'
import { SpacesProvider } from './contexts/SpacesContext'

function App() {
  const { t } = useTranslation();
  const [currentSpaceId, setCurrentSpaceId] = useState<number>(0);
  const { isAuthenticated, isCheckingAuth, setIsAuthenticated } = useAuthenticationVerification();

  const handleSpaceSelect = useCallback((spaceId: number) => {
    setCurrentSpaceId(spaceId);
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
        <SpaceComponent spaceId={currentSpaceId}></SpaceComponent>
        <NaviPanel onSpaceSelect={handleSpaceSelect}></NaviPanel>
      </div>
    </SpacesProvider>
  )
}

export default App
