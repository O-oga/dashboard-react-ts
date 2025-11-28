import { useMemo, memo, useRef, useCallback } from 'react'
import './NaviPanel.css'
import NaviPanelCard from './NaviPanelCard/NaviPanelCard'
import type { Space } from '@/types/space.types'
import NaviPanelAddCard from './NaviPanelAddCard/NaviPanelAddCard'
import AddSpaceModal from '@/components/modals/AddSpaceModal/AddSpaceModal'
import SpacePreviewCard from './SpacePreviewCard/SpacePreviewCard'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useSpaces } from '@/contexts/SpacesContext'
import { SwapIcon } from '@/components/ui/icons/SwapIcon'
import { SettingsIcon } from '@/components/ui/icons/SettingsIcon'
import { ExitIcon } from '@/components/ui/icons/ExitIcon'
import { logout } from '@/modules/loader'

const NaviPanel = () => {
  const { spaces, setCurrentSpaceId } = useSpaces()
  const previewChangeRef = useRef<((space: {
    name: string
    description: string
    icon: SpaceIconTypes
  }) => void) | null>(null)

  const {
    isOpen: isAddCardModalOpen,
    open: openAddCardModal,
    close: closeAddCardModal,
  } = useDisclosure(false, {
    onOpen: () => {
      console.log('openAddCardModal')
    },
    onClose: () => {
      console.log('closeAddCardModal')
    },
  })

  const { isOpen: isChangable, toggle: toggleChangable } = useDisclosure(
    false,
    {
      onOpen: () => {
        console.log('visible')
      },
      onClose: () => {
        console.log('invisible')
      },
    }
  )

  const { swapIcon, settingsIcon, exitIcon } = useMemo(() => ({
    swapIcon: <SwapIcon size={24} color="white" />,
    settingsIcon: <SettingsIcon size={24} color="white" />,
    exitIcon: <ExitIcon size={24} color="white" />,
  }), [])

  // Stable callback
  const handleSpacePreviewChange = useCallback((space: {
    name: string
    description: string
    icon: SpaceIconTypes
  }) => {
    if (previewChangeRef.current) {
      previewChangeRef.current(space)
    }
  }, [])

  // Memoize order values to prevent unnecessary re-sorting when only cards change
  const spacesOrderKey = useMemo(() => {
    const key = spaces.map(s => `${s.id}:${s.order ?? 0}`).join(',')
    console.log(key)
    return key
  }, [spaces])

  const sortedSpaces = useMemo(() => {
    return [...spaces].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [spacesOrderKey])

  const handleLogout = () => {
    logout()
    // Reload the page to show login screen
    window.location.reload()
  }

  return (
    <div
      className={`navi-panel ${isAddCardModalOpen ? 'navi-panel-disabled' : ''}`}
    >
      {/* Display space cards */}
      {sortedSpaces.map((space: Space) => (
        <NaviPanelCard
          key={space.id}
          space={space}
          isChangable={isChangable}
          onSpaceSelect={setCurrentSpaceId}
        // onTitleChange={(next: string) => dispatch({ type: 'changeSpaceTitle', id: space.id, title: next })}
        // onOrderChange={(next: number) => dispatch({ type: 'changeSpaceOrder', id: space.id, order: next })}
        />
      ))}

      {isAddCardModalOpen && (
        <SpacePreviewCard previewChangeRef={previewChangeRef} />
      )}

      {/* Button to create new space */}
      <NaviPanelAddCard onOpenModal={openAddCardModal} />
      <div className="settings-buttons-container">
        <button
          className="change-button button-svg button-svg-small button-svg-dark"
          onClick={toggleChangable}
        >
          {swapIcon}
        </button>
        <button className="settings-button button-svg button-svg-small button-svg-dark">
          {settingsIcon}
        </button>
        <button
          onClick={handleLogout}
          className="exit-button button-svg button-svg-small button-svg-dark"
        >
          {exitIcon}
        </button>
      </div>
      <AddSpaceModal
        isOpen={isAddCardModalOpen}
        onClose={closeAddCardModal}
        onspacePreviewChange={handleSpacePreviewChange}
      />
    </div>
  )
}

export default memo(NaviPanel)
