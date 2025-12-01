import { useMemo, memo } from 'react'
import './NaviPanel.css'
import NaviPanelCard from './NaviPanelCard/NaviPanelCard'
import type { SpaceType } from '@/types/space.types'
import NaviPanelAddCard from './NaviPanelAddCard/NaviPanelAddCard'
import SpacePreviewCard from './SpacePreviewCard/SpacePreviewCard'
import { useSpaces } from '@/contexts/SpacesContext'
// import { SwapIcon } from '@/components/ui/icons/SwapIcon'
import { SettingsIcon } from '@/components/ui/icons/SettingsIcon'
import { ExitIcon } from '@/components/ui/icons/ExitIcon'
import { logout } from '@/modules/loader'
import { useAddSpaceModal } from '@/contexts/AddSpaceModalContext'

const NaviPanel = () => {
  const { spaces, setCurrentSpaceId } = useSpaces()
  const { isOpen, openAddSpaceModal } = useAddSpaceModal()

  // const { isOpen: isChangable, toggle: toggleChangable } = useDisclosure(
  //   false,
  //   {
  //     onOpen: () => {
  //       console.log('visible')
  //     },
  //     onClose: () => {
  //       console.log('invisible')
  //     },
  //   }
  // )

  const { settingsIcon, exitIcon } = useMemo(() => ({
    settingsIcon: <SettingsIcon size={24} color="white" />,
    exitIcon: <ExitIcon size={24} color="white" />,
  }), [])

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
      className={`navi-panel ${isOpen ? 'navi-panel-disabled' : ''}`}
    >
      {/* Display space cards */}
      {sortedSpaces.map((space: SpaceType) => (
        <NaviPanelCard
          key={space.id}
          space={space}
          onSpaceSelect={setCurrentSpaceId}
        // onTitleChange={(next: string) => dispatch({ type: 'changeSpaceTitle', id: space.id, title: next })}
        // onOrderChange={(next: number) => dispatch({ type: 'changeSpaceOrder', id: space.id, order: next })}
        />
      ))}

      {isOpen && (
        <SpacePreviewCard />
      )}

      {/* Button to create new space */}
      <NaviPanelAddCard onOpenModal={openAddSpaceModal} />
      <div className="settings-buttons-container">
        {/* <button
          className="change-button button-svg button-svg-small button-svg-dark"
          onClick={toggleChangable}
        >
          {swapIcon}
        </button> */}
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
    </div>
  )
}

export default memo(NaviPanel)
