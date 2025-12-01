import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import '@/App.css'
import NaviPanel from '@/components/features/navigation/NaviPanel/NaviPanel'
import Space from '@/components/features/spaces/Space/Space'
import LoginPage from '@/components/pages/LoginPage/LoginPage'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher/LanguageSwitcher'
import { useAuthenticationVerification } from '@/modules/autenticationVerification'
import { SpacesProvider } from '@/contexts/SpacesContext'
import { ContextMenuProvider } from '@/contexts/ContextMenuContext'
import { AddSpaceModalProvider, useAddSpaceModal } from '@/contexts/AddSpaceModalContext'
import ContextMenu from '@/components/ContextMenu/ContextMenu'
import { useContextMenuContext } from '@/contexts/ContextMenuContext'
import AddSpaceModal from '@/components/modals/AddSpaceModal/AddSpaceModal'
import type { SpaceIconTypes } from '@/types/Icons.types'

function App() {
  const { t } = useTranslation()
  const { isAuthenticated, isCheckingAuth, setIsAuthenticated } =
    useAuthenticationVerification()

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isCheckingAuth) {
    return (
      <div className="app">
        <LanguageSwitcher />
        <div
          style={{
            color: 'var(--button-text-color)',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          {t('app.checkingConnection')}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <LanguageSwitcher />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    )
  }

  return (
    <SpacesProvider>
      <AddSpaceModalProvider>
        <ContextMenuProvider>
          <AppContent />
        </ContextMenuProvider>
      </AddSpaceModalProvider>
    </SpacesProvider>
  )
}

const AppContent = () => {
  const { menuState, handleRemoveCard, handleEditCard, handleAddCard, handleRemoveSpace, handleAddSpace, handleChangeSpace } = useContextMenuContext();
  const { isOpen, closeAddSpaceModal, setSpacePreview } = useAddSpaceModal();

  const handleSpacePreviewChange = useCallback((space: {
    name: string
    description: string
    icon: string
  }) => {
    setSpacePreview({
      name: space.name,
      description: space.description,
      icon: space.icon as SpaceIconTypes,
    })
  }, [setSpacePreview])

  return (
    <div className="app">
      <Space></Space>
      <NaviPanel></NaviPanel>
      {menuState && menuState.visible && (
        <ContextMenu
          key={menuState.key}
          x={menuState.position.x}
          y={menuState.position.y}
          contextType={menuState.contextType}
          visible={menuState.visible}
          handleRemoveCard={handleRemoveCard}
          handleEditCard={handleEditCard}
          handleAddCard={handleAddCard}
          handleRemoveSpace={handleRemoveSpace}
          handleAddSpace={handleAddSpace}
          handleChangeSpace={handleChangeSpace}
        />
      )}
      <AddSpaceModal
        isOpen={isOpen}
        onClose={closeAddSpaceModal}
        onspacePreviewChange={handleSpacePreviewChange}
      />
    </div>
  )
}

export default App
